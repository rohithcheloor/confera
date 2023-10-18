import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import SimplePeer from 'simple-peer';
import '../../assets/video.css';
import VideoTile from '../../components/video';



const ConferencePage = (props) => {
    const { userData } = props;
    const { roomId, secureRoom, username, password } = userData;
    const [peers, setPeers] = useState([]);
    const videoRef = useRef();
    const peersRef = useRef([]);
    const socketRef = useRef();

    const createPeer = (userToSignal, callerID, stream) => {
        const peer = new SimplePeer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            console.log("Signal Payload", signal);
            socketRef.current.emit("offer", { userToSignal, callerID, signal })
        })

        return peer;
    }

    const addPeer = (incomingSignal, callerID, stream) => {
        const peer = new SimplePeer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            console.log("Signal received, Accepted");
            socketRef.current.emit("accept", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }

    useEffect(() => {
        socketRef.current = io(process.env.REACT_APP_SERVER_URL);
        console.log("Socket Ref : ",socketRef.current);
        socketRef.current.emit('join-room', { roomId, userId: socketRef.current.id, username, password, secureRoom });
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            videoRef.current.srcObject = stream;
            socketRef.current.on('get-peers', (currentUsers) => {
                console.log("Get Peers Payload", currentUsers);
                const users = [];
                currentUsers.forEach(userID => {
                    if (userID !== socketRef.current.id) {
                        const peer = createPeer(userID, socketRef.current.id, stream);
                        peersRef.current.push({
                            peerID: userID,
                            peer,
                        })
                        users.push(peer);
                    }
                });
                setPeers(users);
            });

            socketRef.current.on('user-connected', ({ signal, callerID }) => {
                console.log("User Connected Payload", { signal, callerID, stream });
                const peer = addPeer(signal, callerID, stream);
                peersRef.current.push({
                    peerID: callerID,
                    peer,
                })

                setPeers(users => [...users, peer]);
            });
            socketRef.current.on("answer", payload => {
                console.log("PeersRef Current", peersRef.current);
                console.log("payload.callerID", payload.callerID);
                const item = peersRef.current.find(peer => peer.peerID === payload.callerID);
                item.peer.signal(payload.signal);
            });
        });
        return () => {
            socketRef.current.off('get-peers');
            socketRef.current.off('user-connected');
            socketRef.current.off('answer');
        };
    }, []);

    return (
        <React.Fragment>
            <p>{roomId}</p>
            <video className='video-stream-1' ref={videoRef} autoPlay playsInline muted></video>
            <div className='video-grid'>
                {peers.map((peer, index) => {
                    return (
                        <VideoTile index={index} key={index} peer={peer} />
                    );
                })}
            </div>
        </React.Fragment>
    );
};

export default ConferencePage;