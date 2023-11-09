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
import {
  Button,
  ButtonGroup,
  OverlayTrigger,
  Tooltip,
  Dropdown,
} from "react-bootstrap";
import {
  faVideo,
  faVideoSlash,
  faMicrophone,
  faInfo,
  faMicrophoneSlash,
  faCamera,
  faVolumeHigh,
  faDesktop,
  faUserSlash,
  faUser,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

import { toast } from "react-toastify";
import {
  toggleCamera,
  toggleMicrophone,
  setCamera,
  setMicrophone,
  setSpeaker,
} from "../redux/action/deviceActions";
import { createPosterImage } from "../utilities/imageMaker";

const ConferencePage = (props) => {
  const { userData, deviceData, toggleCamera, toggleMicrophone } = props;
  const { cameraID, microphoneID, isCameraOn, isMicOn } = deviceData;
  const { roomId, secureRoom, username, password } = userData;
  const { setCameraID, setMicrophoneID, setSpeakerID } = props;

  const [peers, setPeers] = useState([]);
  const [myStream, setMyStream] = useState(null);
  const [myView, setMyView] = useState(true);
  const [myPosterImage, setMyPosterImage] = useState(null);
  const [screenShareStream, setScreenShareStream] = useState(null);

  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [speakerDevices, setSpeakerDevices] = useState([]);
  const [videoDeviceName, setVideoDeviceName] = useState(null);
  const [audioDeviceName, setAudioDeviceName] = useState(null);
  const [speakerDeviceName, setSpeakerDeviceName] = useState(null);

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

  const handleCameraChange = (id, name) => {
    setCameraID(id);
    setVideoDeviceName(name);
  };

  const handleMicChange = (id, name) => {
    setMicrophoneID(id);
    setAudioDeviceName(name);
  };

  const handleSpeakerChange = (id, name) => {
    setSpeakerID(id);
    setSpeakerDeviceName(name);
  };

  const handleScreenShare = async () => {
    try {
      if (screenShareStream) {
        // If screen sharing is already active, stop it
        screenShareStream.getTracks().forEach((track) => track.stop());
        setScreenShareStream(null);

        // Remove screen share peer from peersRef
        const updatedPeers = peersRef.current.filter(
          (peer) => peer.peerID !== "screenSharePeerID"
        );
        peersRef.current = updatedPeers;
      } else {
        // Create a new peer for screen share
        const screenPeer = createPeer("screenSharePeerID", null, true);

        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });

        const audioTracks = stream.getAudioTracks();
        const videoTracks = stream.getVideoTracks();

        if (videoTracks) {
          videoTracks.forEach((track) => {
            track.enabled = true;
          });
        }

        if (audioTracks) {
          audioTracks.forEach((track) => {
            track.enabled = true;
          });
        }

        const screenStream = new MediaStream([...videoTracks, ...audioTracks]);

        setScreenShareStream(screenStream);

        stream.getTracks().forEach((track) => track.stop());

        // Add screen share peer to peersRef
        peersRef.current.push({
          peerID: "screenSharePeerID",
          peer: screenPeer,
          peerName: "Screen Share",
        });
      }
    } catch (error) {
      console.error("Error sharing screen:", error);
    }
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
            username,
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

  useEffect(() => {
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
      // socketRef.current.on(
      //   "offer-screen",
      //   async ({ userToSignal, callerID, signal }) => {
      //     const { screenPeer } = createPeer(userToSignal, callerID, false);
      //     screenPeer.signal(signal);
      //   }
      // );

      // socketRef.current.on("accept-screen", ({ signal, callerID }) => {
      //   const item = peersRef.current.find(
      //     (peer) => peer && peer.peerID === callerID
      //   );
      //   item.screenPeer.signal(signal);
      // });

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

      socketRef.current.on("answer", (payload) => {
        const item = peersRef.current.find(
          (peer) => peer && peer.peerID === payload.callerID
        );
        item.peer.signal(payload.signal);
      });

      socketRef.current.on("user-disconnected", (peerData) => {
        const { peerId, peerName } = peerData;
        toast(`${peerName} Disconnected`, { theme: "dark", autoClose: 2000 });
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
          peersRef.current = peersRef.current.filter((item) => item);
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

  useEffect(() => {
    if (!myPosterImage) {
      const myPosterImage =
        String(username).trim().length === 0
          ? createPosterImage("U", 200, 140)
          : createPosterImage(username, 200, 140);
      setMyPosterImage(myPosterImage);
    }
  }, [myPosterImage]);

  useEffect(() => {
    const getMediaDevices = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices =
          devices && devices.filter((device) => device.kind === "videoinput");
        const audioDevices =
          devices && devices.filter((device) => device.kind === "audioinput");
        const speakerDevices =
          devices && devices.filter((device) => device.kind === "audiooutput");
        setVideoDevices(videoDevices);
        setAudioDevices(audioDevices);
        if (videoDevices && videoDevices.length > 0) {
          setVideoDeviceName(videoDevices[0]?.label || "No device selected");
          setCameraID(videoDevices[0]?.deviceId || null);
        }
        if (audioDevices && audioDevices.length > 0) {
          setAudioDeviceName(audioDevices[0]?.label || "No device selected");
          setMicrophoneID(audioDevices[0]?.deviceId || null);
        }
        if (speakerDevices && speakerDevices.length > 0) {
          setSpeakerDeviceName(
            speakerDevices[0]?.label || "No device selected"
          );
          setSpeakerID(speakerDevices[0]?.deviceId);
          setSpeakerDevices(speakerDevices);
        }
      } catch (error) {
        console.error("Error fetching media devices:", error);
      }
    };
    getMediaDevices();
  }, []);

  return (
    <React.Fragment>
      <video
        className="video-stream-1"
        ref={videoRef}
        autoPlay
        playsInline
        muted
        poster={myPosterImage}
      ></video>
      {/* {screenShareStream && (
        <VideoTile
          index={peers.length} // Assign a unique index to the shared screen
          peer={screenShareStream} // Pass the screen sharing stream as a peer
          peerName="Screen Share"
        />
      )} */}

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
        <p>{roomId}</p>
      </div>

      <div className="conf-control-buttons-container">
        <ButtonGroup className="conf-control-buttons">
          <OverlayTrigger
            overlay={<Tooltip>Turn {isCameraOn ? "off" : "on"} Video</Tooltip>}
          >
            <Dropdown as={ButtonGroup} alignRight>
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
              <Dropdown.Toggle
                split
                variant="success"
                id="dropdown-split-basic"
                className="btn-sm roombutton-dropdown"
              />

              <Dropdown.Menu>
                {videoDevices.map((device, index) => (
                  <Dropdown.Item
                    key={`vid_device_${index}`}
                    onClick={() =>
                      handleCameraChange(device.deviceId, device.label)
                    }
                  >
                    {device.label ||
                      `Camera ${device.deviceId.substring(0, 5)}`}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </OverlayTrigger>

          <OverlayTrigger
            overlay={<Tooltip>Turn {isMicOn ? "off" : "on"} Mic </Tooltip>}
          >
            <Dropdown as={ButtonGroup} alignRight>
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

              <Dropdown.Toggle
                split
                variant="success"
                id="dropdown-split-basic"
                className="btn-sm roombutton-dropdown"
              />

              <Dropdown.Menu>
                {audioDevices.map((device, index) => (
                  <Dropdown.Item
                    key={`aud_device_${index}`}
                    onClick={() =>
                      handleMicChange(device.deviceId, device.label)
                    }
                  >
                    {device.label ||
                      `Microphone ${device.deviceId.substring(0, 5)}`}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
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
          <OverlayTrigger overlay={<Tooltip>Screen Sharing</Tooltip>}>
            <Button
              variant="success"
              onClick={handleScreenShare}
              className={`roombutton`}
            >
              <FontAwesomeIcon icon={faDesktop} className="font-icon" />
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
    setCameraID: (camID) => dispatch(setCamera(camID)),
    setMicrophoneID: (micID) => dispatch(setMicrophone(micID)),
    setSpeakerID: (spID) => dispatch(setSpeaker(spID)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConferencePage);
