import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Dropdown, InputGroup, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faVideoSlash,
  faMicrophone,
  faMicrophoneSlash,
  faCamera,
  faVolumeHigh,
} from "@fortawesome/free-solid-svg-icons";
import "../assets/css/VideoGrid.css";
import {
  setCamera,
  setMicrophone,
  setSetupCompleted,
  setSpeaker,
  toggleCamera,
  toggleMicrophone,
  unsetSetupCompleted,
} from "../redux/action/deviceActions";
import { connect as reduxConnect } from "react-redux";
import { toast } from "react-toastify";
const Setup = (props) => {
  const {
    isMobile,
    cameraID,
    microphoneID,
    speakerID,
    setCameraID,
    setMicrophoneID,
    setSpeakerID,
    setSetupCompleted,
    isCameraOn,
    isMicOn,
    toggleCamera,
    toggleMicrophone,
  } = props;

  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [speakerDevices, setSpeakerDevices] = useState([]);
  const [videoDeviceName, setVideoDeviceName] = useState(null);
  const [audioDeviceName, setAudioDeviceName] = useState(null);
  const [speakerDeviceName, setSpeakerDeviceName] = useState(null);

  const videoRef = useRef();
  const toggleVideo = () => {
    toggleCamera();
  };

  const toggleAudio = () => {
    toggleMicrophone();
  };

  // Speaker

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

  useEffect(() => {
    const startVideoStream = async () => {
      try {
        const constraints = {
          video: { deviceId: cameraID ? { exact: cameraID } : undefined },
          audio: {
            deviceId: microphoneID ? { exact: microphoneID } : undefined,
          },
        };
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
  }, [cameraID, microphoneID, isCameraOn, isMicOn]);

  useEffect(() => {
    const video = videoRef.current;

    if (!isMobile) {
      const setSpeaker = () => {
        if (video && video.setSinkId && speakerID) {
          videoRef.current.setSinkId(speakerID);
        }
      };
      setSpeaker();
    }
  }, [speakerID, videoRef]);

  const onJoinRoomClicked = () => {
    setSetupCompleted();
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

  return (
    <React.Fragment>
      <Row className="w-100">
        <Col sm={12} md={6} style={{ paddingRight: 0 }}>
          <div className="video-container">
            <video
              ref={videoRef}
              playsInline={true}
              autoPlay={true}
              className="mirror"
              poster="../images/loader.gif"
            ></video>
            <div className="toggle-buttons-container">
              <a
                className={`initbutton ${isCameraOn ? "active" : "inactive"}`}
                onClick={toggleVideo}
              >
                <FontAwesomeIcon icon={isCameraOn ? faVideo : faVideoSlash} />
              </a>
              <a
                className={`initbutton ${isMicOn ? "active" : "inactive"}`}
                onClick={toggleAudio}
              >
                <FontAwesomeIcon
                  icon={isMicOn ? faMicrophone : faMicrophoneSlash}
                />
              </a>
            </div>
          </div>
        </Col>
        <Col sm={12} md={6}>
          <div className="setup-rightpane-container">
            <div>
              <InputGroup className="mb-3">
                <InputGroup.Text className="setup-input-grp">
                  <FontAwesomeIcon icon={faCamera} />
                </InputGroup.Text>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="success"
                    id="dropdown-basic"
                    className="device-selection-dropdown"
                  >
                    <span className="dropdown-item-text">
                      {videoDeviceName}
                    </span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="device-selection-dropdown-menu">
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
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text className="setup-input-grp">
                  <FontAwesomeIcon icon={faMicrophone} />
                </InputGroup.Text>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="success"
                    id="dropdown-basic"
                    className="device-selection-dropdown"
                  >
                    <span className="dropdown-item-text">
                      {audioDeviceName}
                    </span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="device-selection-dropdown-menu">
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
              </InputGroup>
              {!isMobile && (
                <InputGroup className="mb-3">
                  <InputGroup.Text className="setup-input-grp">
                    <FontAwesomeIcon icon={faVolumeHigh} />
                  </InputGroup.Text>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="success"
                      id="dropdown-basic"
                      className="device-selection-dropdown"
                    >
                      <span className="dropdown-item-text">
                        {speakerDeviceName}
                      </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="device-selection-dropdown-menu">
                      {speakerDevices.map((device, index) => (
                        <Dropdown.Item
                          key={`spkr_device_${index}`}
                          onClick={() =>
                            handleSpeakerChange(device.deviceId, device.label)
                          }
                        >
                          {device.label ||
                            `Speaker ${device.deviceId.substring(0, 5)}`}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </InputGroup>
              )}
            </div>
            <div>
              <div className="d-grid gap-2">
                <Button
                  className="join-room-btn"
                  variant="success"
                  size="lg"
                  onClick={() => onJoinRoomClicked()}
                >
                  Join Room
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};
const mapStateToProps = (state) => {
  const {
    cameraID,
    microphoneID,
    speakerID,
    isSetupComplete,
    isCameraOn,
    isMicOn,
  } = state.devices;
  const { isMobile } = state.common;
  return {
    cameraID,
    microphoneID,
    speakerID,
    isCameraOn,
    isMicOn,
    isSetupComplete,
    isMobile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCameraID: (camID) => dispatch(setCamera(camID)),
    setMicrophoneID: (micID) => dispatch(setMicrophone(micID)),
    setSpeakerID: (spID) => dispatch(setSpeaker(spID)),
    setSetupCompleted: () => dispatch(setSetupCompleted()),
    unsetSetupCompleted: () => dispatch(unsetSetupCompleted()),
    toggleCamera: () => dispatch(toggleCamera()),
    toggleMicrophone: () => dispatch(toggleMicrophone()),
  };
};

export default reduxConnect(mapStateToProps, mapDispatchToProps)(Setup);
