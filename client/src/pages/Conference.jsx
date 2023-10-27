import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import SimplePeer from "simple-peer";
import "../assets/css/video.css";
import VideoTile from "../components/Video";
import { connect } from "react-redux";
import { API_SERVER_URL } from "../utilities/constants";

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

    peer.on("signal", (signal) => {
      socketRef.current.emit("offer", { userToSignal, callerID, signal });
    });

    return peer;
  };

  const addPeer = (incomingSignal, callerID, stream) => {
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("accept", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  };

  useEffect(() => {
    socketRef.current = io(API_SERVER_URL);
    socketRef.current.emit("join-room", {
      roomId,
      userId: socketRef.current.id,
      username,
      password,
      secureRoom,
    });
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        socketRef.current.on("get-peers", (currentUsers) => {
          const users = [];
          currentUsers.forEach((userID) => {
            if (userID !== socketRef.current.id) {
              const peer = createPeer(userID, socketRef.current.id, stream);
              peersRef.current.push({
                peerID: userID,
                peer,
              });
              users.push(peer);
            }
          });
          setPeers(users);
        });

        socketRef.current.on("user-connected", ({ signal, callerID }) => {
          const peer = addPeer(signal, callerID, stream);
          peersRef.current.push({
            peerID: callerID,
            peer,
          });

          setPeers((users) => [...users, peer]);
        });
        socketRef.current.on("answer", (payload) => {
          const item = peersRef.current.find(
            (peer) => peer.peerID === payload.callerID
          );
          item.peer.signal(payload.signal);
        });
      });
    return () => {
      socketRef.current.off("get-peers");
      socketRef.current.off("user-connected");
      socketRef.current.off("answer");
    };
  }, []);

  return (
    <React.Fragment>
      <p>{roomId}</p>
      <video
        className="video-stream-1"
        ref={videoRef}
        autoPlay
        playsInline
        muted
      ></video>
      <div className="video-grid">
        {peers.map((peer, index) => {
          return <VideoTile index={index} key={index} peer={peer} />;
        })}
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
