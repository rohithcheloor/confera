import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import SimplePeer from "simple-peer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faVideoSlash,
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import "../assets/css/video.css";
import VideoTile from "../components/Video";
import { connect } from "react-redux";
import { API_SERVER_URL } from "../utilities/constants";
import { setIsAudioOn, setIsVideoOn } from "../redux/action/deviceActions";

const ConferencePage = (props) => {
  const { userData, deviceData, setVideo, setAudio } = props;
  const { roomId, secureRoom, username, password } = userData;
  const { isAudioOn, isVideoOn, cameraID, microphoneID } = deviceData;
  const [peers, setPeers] = useState([]);
  const videoRef = useRef();
  const peersRef = useRef([]);
  const socketRef = useRef();

  console.log("isAudioOn", isAudioOn);

  const toggleVideo = () => {
    setVideo(!isVideoOn);
  };

  const toggleAudio = () => {
    setAudio(!isAudioOn);
  };

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
    const startVideoStream = async () => {
      try {
        const constraints = {
          video: isVideoOn
            ? {
                deviceId: cameraID ? { exact: cameraID } : undefined,
              }
            : false,
          audio: isAudioOn
            ? {
                deviceId: microphoneID ? { exact: microphoneID } : undefined,
              }
            : false,
        };
        const stream =
          isVideoOn || isAudioOn
            ? await navigator.mediaDevices.getUserMedia(constraints)
            : null;
        if (videoRef.current && cameraID) {
          videoRef.current.srcObject = stream;
        } else {
          videoRef.current.srcObject = null;
        }
      } catch (error) {
        console.error("Error starting video stream:", error);
      }
    };
    startVideoStream();
  }, [cameraID, microphoneID, isVideoOn, isAudioOn]);

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
      {/* <video
        className="video-stream-1"
        ref={videoRef}
        autoPlay
        playsInline
        muted={!isAudioOn}
      ></video> */}
      <video
        ref={videoRef}
        playsInline={true}
        autoPlay={true}
        className="mirror"
        poster="../images/loader.gif"
      ></video>
      <div className="toggle-buttons-container">
        <a
          className={`initbutton ${isVideoOn ? "active" : "inactive"}`}
          onClick={toggleVideo}
        >
          <FontAwesomeIcon icon={isVideoOn ? faVideo : faVideoSlash} />
        </a>
        <a
          className={`initbutton ${isAudioOn ? "active" : "inactive"}`}
          onClick={toggleAudio}
        >
          <FontAwesomeIcon
            icon={isAudioOn ? faMicrophone : faMicrophoneSlash}
          />
        </a>
      </div>
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
  const { cameraID, microphoneID, speakerID, isAudioOn, isVideoOn } =
    state.devices;
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
      isAudioOn,
      isVideoOn,
    },
    loading,
    orgLogo,
    orgName,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAudio: (isOn) => dispatch(setIsAudioOn(isOn)),
    setVideo: (isOn) => dispatch(setIsVideoOn(isOn)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConferencePage);
