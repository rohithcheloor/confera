'use strict';
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const https = require('httpolyglot');
const http = require('http');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const ngrok = require('ngrok');

const bodyParser = require('body-parser');

const app = express();
const options = {
    cert: fs.readFileSync(path.join(__dirname, config.server.ssl.cert), 'utf-8'),
    key: fs.readFileSync(path.join(__dirname, config.server.ssl.key), 'utf-8'),
    passphrase: 'confera'
};
const httpsServer = https.createServer(options, app);
const io = require('socket.io')(httpsServer, {
    maxHttpBufferSize: 1e7,
    transports: ['websocket'],
});
const host = 'https://' + 'localhost' + ':' + config.server.listen.port; // config.server.listen.ip

const hostCfg = {
    protected: config.host.protected,
    username: config.host.username,
    password: config.host.password,
    authenticated: !config.host.protected,
};

const dir = {
    public: path.join(__dirname, '../../', 'public'),
};

const isAuthenticated = require('./api/home');


let announcedIP = config.mediasoup.webRtcTransport.listenIps[0].announcedIp; // AnnouncedIP (server public IPv4)

// Autodetect announcedIP (https://www.ipify.org)
if (!announcedIP) {
    http.get(
        {
            host: 'api.ipify.org',
            port: 80,
            path: '/',
        },
        (resp) => {
            resp.on('data', (ip) => {
                announcedIP = ip.toString();
                config.mediasoup.webRtcTransport.listenIps[0].announcedIp = announcedIP;
                startServer();
            });
        },
    );
} else {
    startServer();
}

function startServer() {
    // Start the app
    app.use(cors());
    app.use(compression());
    app.use(express.json());
    app.use(express.static(dir.public));
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use((req, res, next) => {
        req.hostCfg = hostCfg;
        next();
    })
    // POST start from here...
    app.post('*', function (next) {
        next();
    });

    // GET start from here...
    app.get('*', function (next) {
        next();
    });

    // Remove trailing slashes in url handle bad requests
    app.use((err, req, res, next) => {
        if (err instanceof SyntaxError || err.status === 400 || 'body' in err) {
            return res.status(400).send({ status: 404, message: err.message }); // Bad request
        }
        if (req.path.substr(-1) === '/' && req.path.length > 1) {
            let query = req.url.slice(req.path.length);
            res.redirect(301, req.path.slice(0, -1) + query);
        } else {
            next();
        }
    });
    app.get(['/'], (req, res) => res.end("Confera API Portal"));

    app.get(['/login'], (req, res) => isAuthenticated(req, res));
    httpsServer.listen(config.server.listen.port, () => {
        if (config.ngrok.authToken !== '') {
            return ngrokStart();
        }
        console.log("App Started at PORT:" + config.server.listen.port)
    });


    // handle login on host protected
    app.post(['/login'], (req, res) => {
        if (hostCfg.protected) {
            let ip = getIP(req);
            const { username, password } = checkXSS(req.body);
            if (username == hostCfg.username && password == hostCfg.password) {
                hostCfg.authenticated = true;
                authHost = new Host(ip, true);
                res.status(200).json({ message: 'authorized' });
            } else {
                hostCfg.authenticated = false;
                res.status(401).json({ message: 'unauthorized' });
            }
        } else {
            res.redirect('/');
        }
    });

    // ####################################################
    // API
    // ####################################################

    // request meeting room endpoint
    app.post(['/api/v1/meeting'], (req, res) => {
        // check if user was authorized for the api call
        let host = req.headers.host;
        let authorization = req.headers.authorization;
        let api = new ServerApi(host, authorization);
        if (!api.isAuthorized()) {
            return res.status(403).json({ error: 'Unauthorized!' });
        }
        // setup meeting URL
        let meetingURL = api.getMeetingURL();
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ meeting: meetingURL }));
    });

    // request join room endpoint
    app.post(['/api/v1/join'], (req, res) => {
        // check if user was authorized for the api call
        let host = req.headers.host;
        let authorization = req.headers.authorization;
        let api = new ServerApi(host, authorization);
        if (!api.isAuthorized()) {
            return res.status(403).json({ error: 'Unauthorized!' });
        }
        // setup Join URL
        let joinURL = api.getJoinURL(req.body);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ join: joinURL }));
    });

}

async function ngrokStart() {
    console.log("Starting Ngrok");
    try {
        await ngrok.authtoken(config.ngrok.authToken);
        await ngrok.connect(config.server.listen.port);
        const api = ngrok.getApi();
        // const data = JSON.parse(await api.get('api/tunnels')); // v3
        const data = await api.listTunnels(); // v4
        const pu0 = data.tunnels[0].public_url;
        const pu1 = data.tunnels[1].public_url;
        const tunnel = pu0.startsWith('https') ? pu0 : pu1;
    } catch (err) {
        process.exit(1);
    }
}
// (async () => {
//     try {
//         await createWorkers();
//     } catch (err) {
//         process.exit(1);
//     }
// })();

// async function createWorkers() {
//     const { numWorkers } = config.mediasoup;

//     const { logLevel, logTags, rtcMinPort, rtcMaxPort } = config.mediasoup.worker;
//     for (let i = 0; i < numWorkers; i++) {
//         let worker = await mediasoup.createWorker({
//             logLevel: logLevel,
//             logTags: logTags,
//             rtcMinPort: rtcMinPort,
//             rtcMaxPort: rtcMaxPort,
//         });
//         worker.on('died', () => {
//             setTimeout(() => process.exit(1), 2000);
//         });
//         workers.push(worker);
//     }
// }

// async function getMediasoupWorker() {
//     const worker = workers[nextMediasoupWorkerIdx];
//     if (++nextMediasoupWorkerIdx === workers.length) nextMediasoupWorkerIdx = 0;
//     return worker;
// }

// // ####################################################
// // SOCKET IO
// // ####################################################

// io.on('connection', (socket) => {
//     socket.on('clientError', (error) => {
//         socket.destroy();
//     });
//     socket.on('error', (err) => {
//         socket.destroy();
//     });

//     socket.on('createRoom', async ({ room_id }, callback) => {
//         socket.room_id = room_id;

//         if (roomList.has(socket.room_id)) {
//             callback({ error: 'already exists' });
//         } else {
//             let worker = await getMediasoupWorker();
//             roomList.set(socket.room_id, new Room(socket.room_id, worker, io));
//             callback({ room_id: socket.room_id });
//         }
//     });

//     socket.on('getPeerCounts', async ({ }, callback) => {
//         if (!roomList.has(socket.room_id)) return;

//         const room = roomList.get(socket.room_id);

//         let peerCounts = room.getPeersCount();
//         callback({ peerCounts: peerCounts });
//     });

//     socket.on('cmd', (dataObject) => {
//         if (!roomList.has(socket.room_id)) return;

//         const data = checkXSS(dataObject);

//         const room = roomList.get(socket.room_id);

//         // cmd|foo|bar|....
//         const words = data.split('|');
//         let cmd = words[0];
//         switch (cmd) {
//             case 'privacy':
//                 room.getPeers()
//                     .get(socket.id)
//                     .updatePeerInfo({ type: cmd, status: words[2] == 'true' });
//                 break;
//             default:
//                 break;
//             //...
//         }

//         room.broadCast(socket.id, 'cmd', data);
//     });

//     socket.on('roomAction', async (dataObject) => {
//         if (!roomList.has(socket.room_id)) return;

//         const data = checkXSS(dataObject);

//         const isPresenter = await isPeerPresenter(socket.room_id, data.peer_name, data.peer_uuid);

//         const room = roomList.get(socket.room_id);
//         switch (data.action) {
//             case 'lock':
//                 if (!isPresenter) return;
//                 if (!room.isLocked()) {
//                     room.setLocked(true, data.password);
//                     room.broadCast(socket.id, 'roomAction', data.action);
//                 }
//                 break;
//             case 'checkPassword':
//                 let roomData = {
//                     room: null,
//                     password: 'KO',
//                 };
//                 if (data.password == room.getPassword()) {
//                     roomData.room = room.toJson();
//                     roomData.password = 'OK';
//                 }
//                 room.sendTo(socket.id, 'roomPassword', roomData);
//                 break;
//             case 'unlock':
//                 if (!isPresenter) return;
//                 room.setLocked(false);
//                 room.broadCast(socket.id, 'roomAction', data.action);
//                 break;
//             case 'lobbyOn':
//                 if (!isPresenter) return;
//                 room.setLobbyEnabled(true);
//                 room.broadCast(socket.id, 'roomAction', data.action);
//                 break;
//             case 'lobbyOff':
//                 if (!isPresenter) return;
//                 room.setLobbyEnabled(false);
//                 room.broadCast(socket.id, 'roomAction', data.action);
//                 break;
//             case 'hostOnlyRecordingOn':
//                 if (!isPresenter) return;
//                 room.setHostOnlyRecording(true);
//                 room.broadCast(socket.id, 'roomAction', data.action);
//                 break;
//             case 'hostOnlyRecordingOff':
//                 if (!isPresenter) return;
//                 room.setHostOnlyRecording(false);
//                 room.broadCast(socket.id, 'roomAction', data.action);
//                 break;
//             default:
//                 break;
//         }
//     });

//     socket.on('roomLobby', (dataObject) => {
//         if (!roomList.has(socket.room_id)) return;

//         const data = checkXSS(dataObject);

//         const room = roomList.get(socket.room_id);

//         data.room = room.toJson();

//         if (data.peers_id && data.broadcast) {
//             for (let peer_id in data.peers_id) {
//                 room.sendTo(data.peers_id[peer_id], 'roomLobby', data);
//             }
//         } else {
//             room.sendTo(data.peer_id, 'roomLobby', data);
//         }
//     });

//     socket.on('peerAction', async (dataObject) => {
//         if (!roomList.has(socket.room_id)) return;

//         const data = checkXSS(dataObject);

//         const presenterActions = ['mute', 'hide', 'eject'];
//         if (presenterActions.some((v) => data.action === v)) {
//             const isPresenter = await isPeerPresenter(socket.room_id, data.from_peer_name, data.from_peer_uuid);
//             if (!isPresenter) return;
//         }

//         const room = roomList.get(socket.room_id);

//         data.broadcast
//             ? room.broadCast(data.peer_id, 'peerAction', data)
//             : room.sendTo(data.peer_id, 'peerAction', data);
//     });

//     socket.on('updatePeerInfo', (dataObject) => {
//         if (!roomList.has(socket.room_id)) return;

//         const data = checkXSS(dataObject);

//         const room = roomList.get(socket.room_id);

//         // update my peer_info status to all in the room
//         room.getPeers().get(socket.id).updatePeerInfo(data);
//         room.broadCast(socket.id, 'updatePeerInfo', data);
//     });

//     socket.on('fileInfo', (dataObject) => {
//         if (!roomList.has(socket.room_id)) return;

//         const data = checkXSS(dataObject);

//         if (!isValidFileName(data.fileName)) {
//             return;
//         }

//         const room = roomList.get(socket.room_id);

//         data.broadcast ? room.broadCast(socket.id, 'fileInfo', data) : room.sendTo(data.peer_id, 'fileInfo', data);
//     });

//     socket.on('file', (data) => {
//         if (!roomList.has(socket.room_id)) return;

//         const room = roomList.get(socket.room_id);

//         data.broadcast ? room.broadCast(socket.id, 'file', data) : room.sendTo(data.peer_id, 'file', data);
//     });

//     socket.on('fileAbort', (dataObject) => {
//         if (!roomList.has(socket.room_id)) return;

//         const data = checkXSS(dataObject);

//         roomList.get(socket.room_id).broadCast(socket.id, 'fileAbort', data);
//     });

//     socket.on('shareVideoAction', (dataObject) => {
//         if (!roomList.has(socket.room_id)) return;

//         const data = checkXSS(dataObject);

//         if (data.action == 'open' && !isValidHttpURL(data.video_url)) {
//             return;
//         }
//         const room = roomList.get(socket.room_id);

//         data.peer_id == 'all'
//             ? room.broadCast(socket.id, 'shareVideoAction', data)
//             : room.sendTo(data.peer_id, 'shareVideoAction', data);
//     });

//     socket.on('wbCanvasToJson', (dataObject) => {
//         if (!roomList.has(socket.room_id)) return;

//         const data = checkXSS(dataObject);

//         const room = roomList.get(socket.room_id);
//         room.broadCast(socket.id, 'wbCanvasToJson', data);
//     });

//     socket.on('whiteboardAction', (dataObject) => {
//         if (!roomList.has(socket.room_id)) return;

//         const data = checkXSS(dataObject);

//         const room = roomList.get(socket.room_id);
//         room.broadCast(socket.id, 'whiteboardAction', data);
//     });

//     socket.on('setVideoOff', (dataObject) => {
//         if (!roomList.has(socket.room_id)) return;

//         const data = checkXSS(dataObject);

//         const room = roomList.get(socket.room_id);
//         room.broadCast(socket.id, 'setVideoOff', data);
//     });

//     socket.on('recordingAction', async (dataObject) => {
//         if (!roomList.has(socket.room_id)) return;

//         const data = checkXSS(dataObject);

//         const room = roomList.get(socket.room_id);

//         room.broadCast(data.peer_id, 'recordingAction', data);
//     });

//     socket.on('join', async (dataObject, cb) => {
//         if (!roomList.has(socket.room_id)) {
//             return cb({
//                 error: 'Room does not exist',
//             });
//         }

//         // Get peer IPv4 (::1 Its the loopback address in ipv6, equal to 127.0.0.1 in ipv4)
//         const peer_ip = socket.handshake.headers['x-forwarded-for'] || socket.conn.remoteAddress;

//         // Get peer Geo Location
//         if (config.IPLookup.enabled && peer_ip != '::1') {
//             dataObject.peer_geo = await getPeerGeoLocation(peer_ip);
//         }

//         const data = checkXSS(dataObject);

//         const room = roomList.get(socket.room_id);

//         room.addPeer(new Peer(socket.id, data));

//         if (!(socket.room_id in presenters)) presenters[socket.room_id] = {};

//         const peer_name = room.getPeers()?.get(socket.id)?.peer_info?.peer_name;
//         const peer_uuid = room.getPeers()?.get(socket.id)?.peer_info?.peer_uuid;

//         if (Object.keys(presenters[socket.room_id]).length === 0) {
//             presenters[socket.room_id] = {
//                 peer_ip: peer_ip,
//                 peer_name: peer_name,
//                 peer_uuid: peer_uuid,
//                 is_presenter: true,
//             };
//         }
//         const isPresenter = await isPeerPresenter(socket.room_id, peer_name, peer_uuid);

//         room.getPeers().get(socket.id).updatePeerInfo({ type: 'presenter', status: isPresenter });
//         if (room.isLocked() && !isPresenter) {
//             return cb('isLocked');
//         }

//         if (room.isLobbyEnabled() && !isPresenter) {

//             room.broadCast(socket.id, 'roomLobby', {
//                 peer_id: data.peer_info.peer_id,
//                 peer_name: data.peer_info.peer_name,
//                 lobby_status: 'waiting',
//             });
//             return cb('isLobby');
//         }

//         cb(room.toJson());
//     });

//     socket.on('getRouterRtpCapabilities', (_, callback) => {
//         if (!roomList.has(socket.room_id)) {
//             return callback({ error: 'Room not found' });
//         }

//         const room = roomList.get(socket.room_id);


//         try {
//             callback(room.getRtpCapabilities());
//         } catch (err) {
//             callback({
//                 error: err.message,
//             });
//         }
//     });

//     socket.on('getProducers', () => {
//         if (!roomList.has(socket.room_id)) return;

//         const room = roomList.get(socket.room_id);

//         // send all the current producer to newly joined member
//         let producerList = room.getProducerListForPeer();

//         socket.emit('newProducers', producerList);
//     });

//     socket.on('createWebRtcTransport', async (_, callback) => {
//         if (!roomList.has(socket.room_id)) {
//             return callback({ error: 'Room not found' });
//         }

//         const room = roomList.get(socket.room_id);

//         try {
//             const { params } = await room.createWebRtcTransport(socket.id);
//             callback(params);
//         } catch (err) {
//             callback({
//                 error: err.message,
//             });
//         }
//     });

//     socket.on('connectTransport', async ({ transport_id, dtlsParameters }, callback) => {
//         if (!roomList.has(socket.room_id)) {
//             return callback({ error: 'Room not found' });
//         }

//         const room = roomList.get(socket.room_id);
//         await room.connectPeerTransport(socket.id, transport_id, dtlsParameters);

//         callback('success');
//     });

//     socket.on('produce', async ({ producerTransportId, kind, appData, rtpParameters }, callback) => {
//         if (!roomList.has(socket.room_id)) {
//             return callback({ error: 'Room not found' });
//         }

//         const room = roomList.get(socket.room_id);

//         let peer_name = getPeerName(room, false);

//         // peer_info audio Or video ON
//         let data = {
//             peer_name: peer_name,
//             peer_id: socket.id,
//             kind: kind,
//             type: appData.mediaType,
//             status: true,
//         };

//         await room.getPeers().get(socket.id).updatePeerInfo(data);

//         let producer_id = await room.produce(
//             socket.id,
//             producerTransportId,
//             rtpParameters,
//             kind,
//             appData.mediaType,
//         );

//         // add & monitor producer audio level
//         if (kind === 'audio') {
//             room.addProducerToAudioLevelObserver({ producerId: producer_id });
//         }

//         callback({
//             producer_id,
//         });
//     });

//     socket.on('consume', async ({ consumerTransportId, producerId, rtpCapabilities }, callback) => {
//         if (!roomList.has(socket.room_id)) {
//             return callback({ error: 'Room not found' });
//         }

//         const room = roomList.get(socket.room_id);

//         let params = await room.consume(socket.id, consumerTransportId, producerId, rtpCapabilities);
//         callback(params);
//     });

//     socket.on('producerClosed', (data) => {
//         if (!roomList.has(socket.room_id)) return;
//         const room = roomList.get(socket.room_id);

//         // peer_info audio Or video OFF
//         room.getPeers().get(socket.id).updatePeerInfo(data);
//         room.closeProducer(socket.id, data.producer_id);
//     });

//     socket.on('resume', async (_, callback) => {
//         await consumer.resume();
//         callback();
//     });

//     socket.on('getRoomInfo', async (_, cb) => {
//         if (!roomList.has(socket.room_id)) return;

//         const room = roomList.get(socket.room_id);
//         cb(room.toJson());
//     });

//     socket.on('refreshParticipantsCount', () => {
//         if (!roomList.has(socket.room_id)) return;

//         const room = roomList.get(socket.room_id);

//         let data = {
//             room_id: socket.room_id,
//             peer_counts: room.getPeers().size,
//         };
//         room.broadCast(socket.id, 'refreshParticipantsCount', data);
//     });

//     socket.on('message', (dataObject) => {
//         if (!roomList.has(socket.room_id)) return;

//         const data = checkXSS(dataObject);

//         const room = roomList.get(socket.room_id);

//         // check if the message coming from real peer
//         const realPeer = isRealPeer(data.peer_name, data.peer_id, socket.room_id);
//         if (!realPeer) {
//             const peer_name = getPeerName(room, false);
//             return;
//         }
//         data.to_peer_id == 'all'
//             ? room.broadCast(socket.id, 'message', data)
//             : room.sendTo(data.to_peer_id, 'message', data);
//     });

//     socket.on('getChatGPT', async ({ time, room, name, prompt }, cb) => {
//         if (!roomList.has(socket.room_id)) return;
//         if (!config.chatGPT.enabled) return cb('ChatGPT seems disabled, try later!');
//         try {
//             // https://platform.openai.com/docs/api-reference/completions/create
//             const completion = await chatGPT.completions.create({
//                 model: config.chatGPT.model || 'text-davinci-003',
//                 prompt: prompt,
//                 max_tokens: config.chatGPT.max_tokens,
//                 temperature: config.chatGPT.temperature,
//             });
//             const response = completion.choices[0].text;
//             cb(response);
//         } catch (error) {
//             if (error instanceof OpenAI.APIError) {
//                 cb(error.message);
//             } else {
//                 cb(error);
//             }
//         }
//     });

//     socket.on('disconnect', async () => {
//         if (!roomList.has(socket.room_id)) return;

//         const room = roomList.get(socket.room_id);

//         const peerName = room.getPeers()?.get(socket.id)?.peer_info?.peer_name || '';
//         const peerUuid = room.getPeers()?.get(socket.id)?.peer_info?.peer_uuid || '';
//         const isPresenter = await isPeerPresenter(socket.room_id, peerName, peerUuid);

//         room.removePeer(socket.id);

//         if (room.getPeers().size === 0) {
//             if (room.isLocked()) {
//                 room.setLocked(false);
//             }
//             if (room.isLobbyEnabled()) {
//                 room.setLobbyEnabled(false);
//             }
//             if (roomList.has(socket.room_id)) roomList.delete(socket.room_id);

//             delete presenters[socket.room_id];

//         }

//         room.broadCast(socket.id, 'removeMe', removeMeData(room, peerName, isPresenter));

//         removeIP(socket);
//     });

//     socket.on('exitRoom', async (_, callback) => {
//         if (!roomList.has(socket.room_id)) {
//             return callback({
//                 error: 'Not currently in a room',
//             });
//         }

//         const room = roomList.get(socket.room_id);

//         const peerName = room.getPeers()?.get(socket.id)?.peer_info?.peer_name || '';
//         const peerUuid = room.getPeers()?.get(socket.id)?.peer_info?.peer_uuid || '';
//         const isPresenter = await isPeerPresenter(socket.room_id, peerName, peerUuid);
//         // close transports
//         await room.removePeer(socket.id);

//         room.broadCast(socket.id, 'removeMe', removeMeData(room, peerName, isPresenter));

//         if (room.getPeers().size === 0) {
//             roomList.delete(socket.room_id);
//         }

//         socket.room_id = null;

//         removeIP(socket);

//         callback('Successfully exited room');
//     });

//     // common
//     function getPeerName(room, json = true) {
//         try {
//             let peer_name = (room && room.getPeers()?.get(socket.id)?.peer_info?.peer_name) || 'undefined';

//             if (json) {
//                 return {
//                     peer_name: peer_name,
//                 };
//             }
//             return peer_name;
//         } catch (err) {
//             return json ? { peer_name: 'undefined' } : 'undefined';
//         }
//     }

//     function isRealPeer(name, id, roomId) {
//         const room = roomList.get(roomId);

//         let peerName = (room && room.getPeers()?.get(id)?.peer_info?.peer_name) || 'undefined';

//         return peerName == name;
//     }

//     function isValidFileName(fileName) {
//         const invalidChars = /[\\\/\?\*\|:"<>]/;
//         return !invalidChars.test(fileName);
//     }

//     function isValidHttpURL(input) {
//         const pattern = new RegExp(
//             '^(https?:\\/\\/)?' + // protocol
//             '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
//             '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
//             '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
//             '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
//             '(\\#[-a-z\\d_]*)?$',
//             'i',
//         ); // fragment locator
//         return pattern.test(input);
//     }

//     function removeMeData(room, peerName, isPresenter) {
//         const roomId = room && socket.room_id;
//         const peerCounts = room && room.getPeers().size;
//         return {
//             room_id: roomId,
//             peer_id: socket.id,
//             peer_counts: peerCounts,
//             isPresenter: isPresenter,
//         };
//     }

//     function bytesToSize(bytes) {
//         let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
//         if (bytes == 0) return '0 Byte';
//         let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
//         return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
//     }
// });

// async function isPeerPresenter(room_id, peer_name, peer_uuid) {
//     let isPresenter = false;

//     if (typeof presenters[room_id] === 'undefined' || presenters[room_id] === null) return false;

//     try {
//         isPresenter =
//             typeof presenters[room_id] === 'object' &&
//             Object.keys(presenters[room_id]).length > 1 &&
//             presenters[room_id]['peer_name'] === peer_name &&
//             presenters[room_id]['peer_uuid'] === peer_uuid;
//     } catch (err) {
//         return false;
//     }
//     return isPresenter;
// }

// async function getPeerGeoLocation(ip) {
//     const endpoint = config.IPLookup.getEndpoint(ip);
//     return axios
//         .get(endpoint)
//         .then((response) => response.data)
//         .catch((error) => console.log(error));
// }

// function getIP(req) {
//     return req.headers['x-forwarded-for'] || req.socket.remoteAddress;
// }
// function allowedIP(ip) {
//     return authHost != null && authHost.isAuthorized(ip);
// }
// function removeIP(socket) {
//     if (hostCfg.protected) {
//         let ip = socket.handshake.address;
//         if (ip && allowedIP(ip)) {
//             authHost.deleteIP(ip);
//             hostCfg.authenticated = false;
//         }
//     }
// }



