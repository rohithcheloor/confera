import { DEVICE } from "../types";

export const setDevices = (cameraID, microphoneID, speakerID) => {
  const payload = { cameraID, microphoneID, speakerID };
  return { type: DEVICE.SET_DEVICES, payload };
};

export const setCamera = (cameraID) => {
  const payload = { cameraID };
  return { type: DEVICE.SET_CAMERA_ID, payload };
};

export const setMicrophone = (microphoneID) => {
  const payload = { microphoneID };
  return { type: DEVICE.SET_MICROPHONE_ID, payload };
};

export const setSpeaker = (speakerID) => {
  const payload = { speakerID };
  return { type: DEVICE.SET_SPEAKER_ID, payload };
};
export const setSetupCompleted = () => {
  return { type: DEVICE.SET_SETUP_COMPLETED };
};
export const unsetSetupCompleted = () => {
  return { type: DEVICE.UNSET_SETUP_COMPLETED };
};
export const getCamera = () => {
  return { type: DEVICE.GET_CAMERA_ID };
};

export const getMicrophone = () => {
  return { type: DEVICE.GET_MICROPHONE_ID };
};

export const getSpeaker = () => {
  return { type: DEVICE.GET_SPEAKER_ID };
};

export const getDevices = () => {
  return { type: DEVICE.GET_DEVICES };
};

export const toggleCamera = () => {
  return { type: DEVICE.TOGGLE_CAMERA_ON };
};

export const toggleMicrophone = () => {
  return { type: DEVICE.TOGGLE_MIC_ON };
};
