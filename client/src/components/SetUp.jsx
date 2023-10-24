import React, { useState, useEffect } from "react";

function SetUp() {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [speakerDevices, setSpeakerDevices] = useState([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState(null);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState(null);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);

  const toggleVideo = () => {
    setIsVideoOn((prev) => !prev);
    const videoElement = document.getElementById("initVideo");

    if (videoElement) {
      if (isVideoOn) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
    }
  };

  const toggleAudio = () => {
    setIsAudioOn((prev) => !prev);
    const videoElement = document.getElementById("initVideo");

    if (videoElement) {
      const audioTracks = videoElement.srcObject.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = isAudioOn;
      });
    }
  };

  const getMediaDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      const audioDevices = devices.filter(
        (device) => device.kind === "audioinput"
      );
      setVideoDevices(videoDevices);
      setAudioDevices(audioDevices);
      setSelectedVideoDevice(videoDevices[0]?.deviceId || null);
      setSelectedAudioDevice(audioDevices[0]?.deviceId || null);
    } catch (error) {
      console.error("Error fetching media devices:", error);
    }
  };

  const startVideoStream = async () => {
    try {
      const constraints = {
        video: {
          deviceId: selectedVideoDevice
            ? { exact: selectedVideoDevice }
            : undefined,
        },
        audio: {
          deviceId: selectedAudioDevice
            ? { exact: selectedAudioDevice }
            : undefined,
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const videoElement = document.getElementById("initVideo");
      if (videoElement) {
        videoElement.srcObject = stream;
      }
    } catch (error) {
      console.error("Error starting video stream:", error);
    }
  };

  // Speaker

  const getSpeakers = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const speakerDevices = devices.filter(
        (device) => device.kind === "audiooutput"
      );
      setSelectedSpeaker(speakerDevices[0]?.deviceId || null);
    } catch (error) {
      console.error("Error fetching speaker devices:", error);
    }
  };

  const setSpeaker = () => {
    const audioElement = document.getElementById("initVideo");
    if (audioElement) {
      const audioOutput = selectedSpeaker
        ? { deviceId: { exact: selectedSpeaker } }
        : undefined;
      audioElement.setSinkId(audioOutput);
    }
  };

  useEffect(() => {
    getMediaDevices();
    getSpeakers();
  }, []);

  useEffect(() => {
    if (selectedVideoDevice || selectedAudioDevice) {
      startVideoStream();
    }
  }, [selectedVideoDevice, selectedAudioDevice, isVideoOn]);

  useEffect(() => {
    setSpeaker();
  }, [selectedSpeaker]);

  console.log("speakers..", speakerDevices);

  return (
    <section>
      <div
        className="swal2-container swal2-center swal2-backdrop-show"
        style={{ overflow: "auto" }}
      >
        <div className="swal2-popup">
          <h2
            className="swal2-title"
            id="swal2-title"
            style={{ display: "block" }}
          >
            Confera
          </h2>
          <div id="initUser" className="init-user">
            <div className="container">
              {isVideoOn && (
                <video
                  id="initVideo"
                  playsInline={true}
                  autoPlay={true}
                  className="mirror"
                  poster="../images/loader.gif"
                  style={{ width: "100%" }}
                ></video>
              )}
            </div>
            <button
              id="initVideoButton"
              className={`fas fa-video ${isVideoOn ? "active" : ""}`}
              onClick={toggleVideo}
            ></button>
            <button
              id="initAudioButton"
              className={`fas fa-microphone ${isAudioOn ? "active" : ""}`}
              onClick={toggleAudio}
            ></button>

            <select
              id="initVideoSelect"
              className="form-select text-light bg-dark"
              onChange={(e) => setSelectedVideoDevice(e.target.value)}
            >
              {videoDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${device.deviceId.substring(0, 5)}`}
                </option>
              ))}
            </select>

            <select
              id="initMicrophoneSelect"
              className="form-select text-light bg-dark"
              onChange={(e) => setSelectedAudioDevice(e.target.value)}
            >
              {audioDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label ||
                    `Microphone ${device.deviceId.substring(0, 5)}`}
                </option>
              ))}
            </select>

            <select
              id="initSpeakerSelect"
              className="form-select text-light bg-dark"
              value={selectedSpeaker || ""}
              onChange={(e) => setSelectedSpeaker(e.target.value)}
            >
              {speakerDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Speaker ${device.deviceId.substring(0, 5)}`}
                </option>
              ))}
            </select>

            {/* ... rest of your code ... */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SetUp;
