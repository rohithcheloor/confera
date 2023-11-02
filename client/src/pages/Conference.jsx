import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import SimplePeer from "simple-peer";
import "../assets/css/video.css";
import VideoTile from "../components/Video";
import { connect } from "react-redux";
import { API_SERVER_URL } from "../utilities/constants";
import { toast } from "react-toastify";

const ConferencePage = (props) => {
  const { userData, deviceData } = props;
  const { cameraID, microphoneID } = deviceData;
  const { roomId, secureRoom, username, password } = userData;

  const [peers, setPeers] = useState([]);
  const [myStream, setMyStream] = useState(null);

  const videoRef = useRef();
  const peersRef = useRef([]);
  const socketRef = useRef();

  const validateExistingPeer = (peerID) => {
    if (
      peersRef.current &&
      peersRef.current.filter((peer) => peer.peerID === peerID).length > 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    socketRef.current = io(API_SERVER_URL);
    const constraints = {
      video: cameraID
        ? {
            deviceId: { exact: cameraID },
          }
        : false,
      audio: microphoneID
        ? {
            deviceId: { exact: microphoneID },
          }
        : false,
    };
    const connectLocalVideo = async () => {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setMyStream(stream);
    };
    connectLocalVideo();
  }, [cameraID, microphoneID]);

  useEffect(() => {
    const joinRoom = async () => {
      await socketRef.current.emit("join-room", {
        roomId,
        userId: socketRef.current.id,
        username,
        password,
        secureRoom,
      });
    };
    joinRoom();
  }, [roomId, username, password, secureRoom]);

  useEffect(() => {
    const createPeer = (userToSignal, callerID, isInitiator) => {
      if (myStream) {
        const peer = new SimplePeer({
          initiator: isInitiator,
          trickle: false,
          stream: myStream,
        });
        if (isInitiator) {
          peer.on("signal", async (signal) => {
            await socketRef.current.emit("offer", {
              userToSignal,
              callerID,
              signal,
            });
          });
        } else {
          peer.on("signal", async (signal) => {
            await socketRef.current.emit("accept", { signal, callerID });
          });
          if (!validateExistingPeer(userToSignal)) {
            peer.signal(userToSignal);
          }
        }
        return peer;
      }
    };

    const addPeers = async (myPeers, isInitiator) => {
      const users = [...peers];
      myPeers.forEach(async (peerId) => {
        if (peerId !== socketRef.current.id) {
          if (!validateExistingPeer(peerId)) {
            const newPeer = createPeer(
              peerId,
              socketRef.current.id,
              isInitiator
            );
            const peerData = {
              peerID: peerId,
              peer: newPeer,
            };
            peersRef.current.push(peerData);
            users.push(newPeer);
          }
        }
      });
      setPeers(users);
    };
    if (myStream && socketRef.current) {
      socketRef.current.on("get-peers", (myPeers) => {
        addPeers(myPeers, true);
      });

      socketRef.current.on("user-connected", ({ signal, callerID }) => {
        if (!validateExistingPeer(callerID)) {
          const newPeer = createPeer(signal, callerID, false);
          peersRef.current.push({
            peerID: callerID,
            peer: newPeer,
          });
          setPeers((users) => [...users, newPeer]);
        }
      });

      socketRef.current.on("answer", (payload) => {
        const item = peersRef.current.find(
          (peer) => peer.peerID === payload.callerID
        );
        item.peer.signal(payload.signal);
      });

      socketRef.current.on("user-disconnected", (peerData) => {
        const { peerId, peerName } = peerData;
        toast(`${peerName} Disconnected`);
        const newPeersList = peers.filter((peer) => peer.peerID !== peerId);
        setPeers(newPeersList);
        const peerIndex = peersRef.current.findIndex(
          (peer) => peer.peerID === peerId
        );
        if (peerIndex) {
          peersRef.current.splice(peerIndex, 1);
        }
      });

      return () => {
        socketRef.current.off("get-peers");
        socketRef.current.off("user-connected");
        socketRef.current.off("answer");
      };
    }
  }, [myStream]);

  return (
    <React.Fragment>
      <video
        className="video-stream-1"
        ref={videoRef}
        autoPlay
        playsInline
        muted
      ></video>
      <div className="video-grid">
        {peers.map((peerItem, index) => {
          return <VideoTile index={index} key={index} peer={peerItem} />;
        })}
        <p>{roomId}</p>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  const { roomId, username, secureRoom, joinLink } = state.login;
  const { cameraID, microphoneID, speakerID } = state.devices;
  const { loading, orgName, orgLogo } = state.common;
  return {
    userData: {
      roomId,
      username,
      secureRoom,
      joinLink,
    },
    deviceData: {
      cameraID,
      microphoneID,
      speakerID,
    },
    loading,
    orgLogo,
    orgName,
  };
};

export default connect(mapStateToProps)(ConferencePage);
