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
  unsetSetupCompleted,
} from "../redux/action/deviceActions";
import { connect as reduxConnect } from "react-redux";
const SetUp = (props) => {
  const {
    cameraID,
    microphoneID,
    speakerID,
    setCameraID,
    setMicrophoneID,
    setSpeakerID,
    setSetupCompleted
  } = props;

  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [speakerDevices, setSpeakerDevices] = useState([]);
  const [videoDeviceName, setVideoDeviceName] = useState(null);
  const [audioDeviceName, setAudioDeviceName] = useState(null);
  const [speakerDeviceName, setSpeakerDeviceName] = useState(null);

  const videoRef = useRef();
  const toggleVideo = () => {
    setIsVideoOn((prev) => !prev);
    if (videoRef.current) {
      if (isVideoOn) {
        setCameraID(null);
        videoRef.current.pause();
      } else {
        if (videoDevices && videoDevices.length > 0) {
          setVideoDeviceName(videoDevices[0]?.label || "No device selected");
          setCameraID(videoDevices[0]?.deviceId || null);
        }
        videoRef.current.play();
      }
    }
  };

  const toggleAudio = () => {
    setIsAudioOn((prev) => !prev);

    if (videoRef.current) {
      const audioTracks = videoRef.current.srcObject
        ? videoRef.current.srcObject.getAudioTracks()
        : null;
      if (audioTracks) {
        audioTracks.forEach((track) => {
          track.enabled = isAudioOn;
        });
      }
    }
  };

  // Speaker

  useEffect(() => {
    const getMediaDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices =
          devices && devices.filter((device) => device.kind === "videoinput");
        const audioDevices =
          devices && devices.filter((device) => device.kind === "audioinput");
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
      } catch (error) {
        console.error("Error fetching media devices:", error);
      }
    };

    const getSpeakers = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const speakerDevices =
          devices && devices.filter((device) => device.kind === "audiooutput");
        if (speakerDevices && speakerDevices.length > 0) {
          setSpeakerDeviceName(
            speakerDevices[0]?.label || "No device selected"
          );
          setSpeakerID(speakerDevices[0]?.deviceId);
          setSpeakerDevices(speakerDevices);
        }
      } catch (error) {
        console.error("Error fetching speaker devices:", error);
      }
    };
    getMediaDevices();
    getSpeakers();
  }, []);

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
    const setSpeaker = () => {
      if (videoRef.current && speakerID) {
        videoRef.current.setSinkId(speakerID);
      }
    };
    setSpeaker();
  }, [speakerID, videoRef]);

  const onJoinRoomClicked = () => {
    setSetupCompleted();
  };

  return (
    <React.Fragment>
      <Row className="w-100">
        <Col sm={12} md={6}>
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
                    {videoDeviceName}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="device-selection-dropdown-menu">
                    {videoDevices.map((device,index) => (
                      <Dropdown.Item
                        key={`vid_device_${index}`}
                        onChange={() => setCameraID(device.deviceId)}
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
                    {audioDeviceName}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="device-selection-dropdown-menu">
                    {audioDevices.map((device,index) => (
                      <Dropdown.Item
                        key={`aud_device_${index}`}
                        onChange={() => setMicrophoneID(device.deviceId)}
                      >
                        {device.label ||
                          `Microphone ${device.deviceId.substring(0, 5)}`}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </InputGroup>
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
                    {speakerDeviceName}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="device-selection-dropdown-menu">
                    {speakerDevices.map((device,index) => (
                      <Dropdown.Item
                        key={`spkr_device_${index}`}
                        onChange={() => setSpeakerID(device.deviceId)}
                      >
                        {device.label ||
                          `Speaker ${device.deviceId.substring(0, 5)}`}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </InputGroup>
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
  const { cameraID, microphoneID, speakerID, isSetupComplete } = state.devices;
  return {
    cameraID,
    microphoneID,
    speakerID,
    isSetupComplete,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCameraID: (camID) => dispatch(setCamera(camID)),
    setMicrophoneID: (micID) => dispatch(setMicrophone(micID)),
    setSpeakerID: (spID) => dispatch(setSpeaker(spID)),
    setSetupCompleted: () => dispatch(setSetupCompleted()),
    unsetSetupCompleted: () => dispatch(unsetSetupCompleted()),
  };
};

export default reduxConnect(mapStateToProps, mapDispatchToProps)(SetUp);
