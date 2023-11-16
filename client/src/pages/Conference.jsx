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
import { Button, ButtonGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  faVideo,
  faVideoSlash,
  faMicrophone,
  faInfo,
  faMicrophoneSlash,
  faUserSlash,
  faUser,
  faArrowRightFromBracket,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { toggleCamera, toggleMicrophone } from "../redux/action/deviceActions";
import { createPosterImage } from "../utilities/imageMaker";
import Chat from "../components/Chat";

const ConferencePage = (props) => {
  const { userData, deviceData, toggleCamera, toggleMicrophone } = props;
  const { cameraID, microphoneID, isCameraOn, isMicOn } = deviceData;
  const { roomId, secureRoom, username, password } = userData;

  const [peers, setPeers] = useState([]);
  const [myStream, setMyStream] = useState(null);
  const [myView, setMyView] = useState(true);
  const [myPosterImage, setMyPosterImage] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const videoRef = useRef();
  const peersRef = useRef([]);
  const socketRef = useRef();

  const handleCamera = () => {
    toggleCamera();
  };

  const handleMicrophone = () => {
    toggleMicrophone();
  };

  const handleLogout = () => {
    window.location.reload();
  };

  const handleMyView = () => {
    videoRef.current.style.setProperty("display", myView ? "none" : "");
    setMyView(!myView);
  };

  const handleChatView = () => {
    setShowChat(!showChat);
  };

  const validateExistingPeer = (peerID) => {
    if (
      peersRef.current &&
      peersRef.current.filter(
        (peer) => peer.peerID === peerID || peer.peerID === socketRef.current.id
      ).length > 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  const getPeerName = (peerId) => {
    if (peersRef.current) {
      const peerDetails = peersRef.current.filter(
        (peer) => peer.peerID === peerId
      );
      if (peerDetails.length > 0) {
        return peerDetails[0].peerName;
      } else {
        return null;
      }
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
    if (!myStream) {
      connectLocalVideo();
    } else {
      const audioTracks = myStream.getAudioTracks();
      const videoTracks = myStream.getVideoTracks();
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
        videoRef.current.srcObject = myStream;
      }
    }
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
      if (myStream) {
        const peer = new SimplePeer({
          initiator: isInitiator,
          trickle: true,
          stream: myStream,
        });
        if (isInitiator) {
          peer.on("signal", async (signal) => {
            await socketRef.current.emit("offer", {
              userToSignal,
              callerID,
              signal,
              username,
            });
          });
        } else {
          peer.on("signal", async (signal) => {
            console.log("Signal Received :", signal);
            await socketRef.current.emit("accept", { signal, callerID });
          });
          if (!validateExistingPeer(userToSignal)) {
            peer.signal(userToSignal);
          }
          peer.on("end", () => {
            console.log("Peer Closed");
            peer.destroy();
          });
        }
        peer.on("error", (err) => {
          toast.error(err.message);
        });
        return peer;
      }
    };

    const addPeers = async (myPeers, isInitiator) => {
      const users = [...peers];
      myPeers.forEach(async (peerDetails) => {
        if (peerDetails.id !== socketRef.current.id) {
          if (!validateExistingPeer(peerDetails.id)) {
            const newPeer = createPeer(
              peerDetails.id,
              socketRef.current.id,
              isInitiator
            );
            const peerData = {
              peerID: peerDetails.id,
              peer: newPeer,
              peerName: peerDetails.name,
            };
            peersRef.current.push(peerData);
            users.push(newPeer);
          }
        }
      });
      if (peersRef && peersRef.current) {
        peersRef.current.filter((i) => i);
        const myPeersList = peersRef.current.map((item) => {
          if (item.peer) {
            item.peer.peerID = item.peerID;
          }
          return item.peer;
        });
        setPeers(myPeersList);
      }
    };
    if (myStream && socketRef.current) {
      socketRef.current.on("get-peers", (myPeers) => {
        addPeers(myPeers, true);
      });

      socketRef.current.on(
        "user-connected",
        ({ signal, callerID, peerName }) => {
          if (!validateExistingPeer(callerID)) {
            const newPeer = createPeer(signal, callerID, false);
            peersRef.current.push({
              peerID: callerID,
              peer: newPeer,
              peerName,
            });
            if (peersRef && peersRef.current) {
              const myPeersList = peersRef.current.map((item) => {
                if (item.peer) {
                  item.peer.peerID = item.peerID;
                }
                return item.peer;
              });
              setPeers(myPeersList);
            }
          }
        }
      );

      socketRef.current.on("answer", async (payload) => {
        const item = peersRef.current.find(
          (peer) => peer && peer.peerID === payload.callerID
        );
        await item.peer.signal(payload.signal);
      });

      // socketRef.current.on("update-peers", (newPeersList = []) => {
      //   const updatedPeersList = [];
      //   // setPeers([]);
      //   peersRef.current.forEach((item, index) => {
      //     if (
      //       newPeersList.includes(item.peerID) &&
      //       item.peerID !== socketRef.current.id
      //     ) {
      //       updatedPeersList.push(item.peer);
      //     } else if (item.peerID !== socketRef.current.id) {
      //       const streamData = item.peer.streams[0];
      //       streamData.getTracks().forEach(track => track.stop());
      //       item.peer.destroy();
      //       console.log("Destroying Peer : " + item.peerID);
      //       delete peersRef.current[index];
      //     }
      //   });
      //   setPeers(updatedPeersList);
      // });

      socketRef.current.on("user-disconnected", (peerData) => {
        const { peerId, peerName } = peerData;
        toast(`${peerName} Disconnected`, { theme: "dark", autoClose: 2000 });
        const peerIndex =
          peersRef.current &&
          peersRef.current.findIndex((item) => item.peerID === peerId);
        const disconnectedPeer = peersRef.current.filter(
          (item) => item.peerID === peerId
        )[0];
        if (disconnectedPeer) {
          const streamData = disconnectedPeer.peer.streams[0];
          console.log(disconnectedPeer.peer);
          streamData.getTracks().forEach((track) => track.stop());
          disconnectedPeer.peer.readable = false;
          disconnectedPeer.peer.destroy();
        }
        if (peersRef.current && peerIndex) {
          delete peersRef.current[peerIndex];
        }
      });

      window.addEventListener("beforeunload", () => {
        socketRef.current.emit("disconnect");
      });

      return () => {
        socketRef.current.off("get-peers");
        socketRef.current.off("user-connected");
        socketRef.current.off("answer");
      };
    }
  }, [myStream]);

  useEffect(() => {
    if (!myPosterImage) {
      const myPosterImage =
        String(username).trim().length === 0
          ? createPosterImage("U")
          : createPosterImage(username);
      setMyPosterImage(myPosterImage);
    }
  }, [myPosterImage]);

  return (
    <React.Fragment>
      <video
        className="video-stream-1"
        ref={videoRef}
        poster={myPosterImage}
        autoPlay
        playsInline
        muted
      ></video>
      <div className="video-grid">
        {peers.length > 0 &&
          peers.map((peerItem, index) => {
            return (
              <VideoTile
                index={index}
                key={index}
                peer={peerItem}
                peerName={getPeerName(peerItem.peerID)}
              />
            );
          })}
      </div>
      <div className="conf-control-buttons-container">
        <ButtonGroup className="conf-control-buttons">
          <OverlayTrigger
            overlay={<Tooltip>Turn {isCameraOn ? "off" : "on"} Video</Tooltip>}
          >
            <Button
              variant={isCameraOn ? "success" : "danger"}
              onClick={handleCamera}
              className={`roombutton`}
            >
              <FontAwesomeIcon
                icon={isCameraOn ? faVideo : faVideoSlash}
                className="font-icon"
              />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            overlay={<Tooltip>Turn {isMicOn ? "off" : "on"} Mic </Tooltip>}
          >
            <Button
              variant={isMicOn ? "success" : "danger"}
              onClick={handleMicrophone}
              className={`roombutton`}
            >
              <FontAwesomeIcon
                icon={isMicOn ? faMicrophone : faMicrophoneSlash}
                className="font-icon"
              />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger overlay={<Tooltip>Show Room Information</Tooltip>}>
            <Button
              variant="success"
              className={`roombutton`}
              onClick={openPopup}
            >
              <FontAwesomeIcon icon={faInfo} className="font-icon" />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            overlay={
              <Tooltip>{myView ? "Hide" : "Show"} my Camera View</Tooltip>
            }
          >
            <Button
              variant="success"
              className={`roombutton`}
              onClick={handleMyView}
            >
              <FontAwesomeIcon
                icon={myView ? faUserSlash : faUser}
                className="font-icon"
              />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger overlay={<Tooltip>Chat</Tooltip>}>
            <Button
              variant="primary"
              className={`roombutton`}
              onClick={handleChatView}
            >
              <FontAwesomeIcon icon={faMessage} className="font-icon" />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger overlay={<Tooltip>Exit Room</Tooltip>}>
            <Button
              variant="danger"
              className={`roombutton`}
              onClick={handleLogout}
            >
              <FontAwesomeIcon
                icon={faArrowRightFromBracket}
                className="font-icon"
              />
            </Button>
          </OverlayTrigger>
        </ButtonGroup>
      </div>
      <Popup open={isPopupOpen} onClose={() => setIsPopOpen(false)}>
        <RoomDetailsMenu
          userData={userData}
          isPopupOpen={isPopupOpen}
          setIsPopOpen={setIsPopOpen}
        />
      </Popup>
      {socketRef.current && (
        <Chat
          socket={socketRef.current}
          showChat={showChat}
          closeChat={handleChatView}
        />
      )}
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
