import React, { useState, useEffect, useRef } from "react";
import Popup from "reactjs-popup";
import io from "socket.io-client";
import SimplePeer from "simple-peer";
import "../assets/css/video.css";
import VideoTile from "../components/Video";
import { connect } from "react-redux";
import { API_SERVER_URL } from "../utilities/constants";
import RoomDetailsMenu from "../components/RoomDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ButtonGroup } from "react-bootstrap";
import {
  faVideo,
  faVideoSlash,
  faMicrophone,
  faInfo,
  faMicrophoneSlash,
  faCamera,
  faVolumeHigh,
  faUserSlash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { toggleCamera, toggleMicrophone } from "../redux/action/deviceActions";

const ConferencePage = (props) => {
  const { userData, deviceData, toggleCamera, toggleMicrophone } = props;
  const { cameraID, microphoneID, isCameraOn, isMicOn } = deviceData;
  const { roomId, secureRoom, username, password } = userData;

  const [peers, setPeers] = useState([]);
  const [myStream, setMyStream] = useState(null);
  const [myView, setMyView] = useState(true);

  const videoRef = useRef();
  const peersRef = useRef([]);
  const socketRef = useRef();

  const handleCamera = () => {
    toggleCamera();
  };

  const handleMicrophone = () => {
    toggleMicrophone();
  };

  const handleMyView = () => {
    console.log(videoRef.current);
    videoRef.current.style.setProperty('display', myView ? 'none' : '');
    setMyView(!myView);
  };

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

  const [isPopupOpen, setIsPopOpen] = useState(false);
  const openPopup = () => {
    setIsPopOpen(true);
  };

  useEffect(() => {
    socketRef.current = io(API_SERVER_URL);
    const constraints = {
      video: {
        deviceId: { exact: cameraID },
      },
      audio: {
        deviceId: { exact: microphoneID },
      },
    };
    const connectLocalVideo = async () => {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const audioTracks = stream.getAudioTracks();
      const videoTracks = stream.getVideoTracks();
      if (videoTracks) {
        videoTracks.forEach((track) => {
          track.enabled = isCameraOn;
        });
      }
      if (audioTracks) {
        audioTracks.forEach((track) => {
          track.enabled = isMicOn;
        });
      }
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setMyStream(stream);
    };
    connectLocalVideo();
  }, [cameraID, microphoneID, isCameraOn, isMicOn]);

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
      console.log("Creating Peer");
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
      if (peersRef && peersRef.current) {
        const myPeersList = peersRef.current.map((item) => {
          if (item.peer) {
            item.peer.peerID = item.peerID;
          }
          return item.peer;
        });
        console.log(myPeersList);
        setPeers(myPeersList);
      }
    };
    if (myStream && socketRef.current) {
      socketRef.current.on("get-peers", (myPeers) => {
        console.log("GET PEERS");
        addPeers(myPeers, true);
      });

      socketRef.current.on("user-connected", ({ signal, callerID }) => {
        if (!validateExistingPeer(callerID)) {
          const newPeer = createPeer(signal, callerID, false);
          peersRef.current.push({
            peerID: callerID,
            peer: newPeer,
          });
          if (peersRef && peersRef.current) {
            const myPeersList = peersRef.current.map((item) => {
              if (item.peer) {
                item.peer.peerID = item.peerID;
              }
              return item.peer;
            });
            console.log(myPeersList);
            setPeers(myPeersList);
          }
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
        console.log("Peers List", peersRef.current);
        if (peersRef.current) {
          const newPeersList = [];
          peersRef.current.forEach((item, index) => {
            if (item.peerID !== peerId) {
              newPeersList.push(item.peer);
            } else {
              const disconnectedPeer = peersRef.current[index].peer;
              delete peersRef.current[index];
              disconnectedPeer.destroy();
            }
          });
          console.log(newPeersList);
          setPeers(newPeersList);
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
        {console.log("Updated Peers", peers)}
        {peers.length > 0 &&
          peers.map((peerItem, index) => {
            return <VideoTile index={index} key={index} peer={peerItem} />;
          })}
        <p>{roomId}</p>
      </div>
      <div className="conf-control-buttons-container">
        <ButtonGroup className="conf-control-buttons">
          <Button
            variant="success"
            onClick={handleCamera}
            className={`initbutton ${isCameraOn ? "active" : "inactive"}`}
          >
            <FontAwesomeIcon
              icon={isCameraOn ? faVideoSlash : faVideo}
              className="font-icon"
            />
          </Button>
          <Button
            variant="success"
            onClick={handleMicrophone}
            className={`initbutton ${isMicOn ? "active" : "inactive"}`}
          >
            <FontAwesomeIcon
              icon={isMicOn ? faMicrophoneSlash : faMicrophone}
              className="font-icon"
            />
          </Button>
          <Button variant="success" onClick={openPopup}>
            <FontAwesomeIcon icon={faInfo} className="font-icon" />
          </Button>
          <Button variant="success" onClick={handleMyView}>
            <FontAwesomeIcon
              icon={myView ? faUserSlash : faUser}
              className="font-icon"
            />
          </Button>
        </ButtonGroup>
      </div>
      <Popup open={isPopupOpen} onClose={() => setIsPopOpen(false)}>
        <RoomDetailsMenu
          userData={userData}
          isPopupOpen={isPopupOpen}
          setIsPopOpen={setIsPopOpen}
        />
      </Popup>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  const { roomId, username, secureRoom, joinLink } = state.login;
  const { cameraID, microphoneID, speakerID, isCameraOn, isMicOn } =
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
      isCameraOn,
      isMicOn,
    },
    loading,
    orgLogo,
    orgName,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleCamera: () => dispatch(toggleCamera()),
    toggleMicrophone: () => dispatch(toggleMicrophone()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConferencePage);
