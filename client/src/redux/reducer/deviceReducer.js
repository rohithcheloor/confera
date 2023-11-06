import { DEVICE } from "../types";

const initState = {
  cameraID: null,
  microphoneID: null,
  speakerID: null,
  isSetupComplete: false,
  isCameraOn: true,
  isMicOn: true,
};

const DeviceReducer = (state = initState, { type, payload = {} }) => {
  switch (type) {
    case DEVICE.GET_DEVICES:
      return state;
    case DEVICE.SET_DEVICES:
      return {
        ...state,
        cameraID: payload.cameraID,
        microphoneID: payload.microphoneID,
        speakerID: payload.speakerID,
        isSetupComplete: payload.isSetupComplete,
      };
    case DEVICE.GET_CAMERA_ID:
      return state.cameraID;
    case DEVICE.GET_MICROPHONE_ID:
      return state.microphoneID;
    case DEVICE.GET_SPEAKER_ID:
      return state.speakerID;
    case DEVICE.SET_CAMERA_ID:
      return { ...state, cameraID: payload.cameraID };
    case DEVICE.SET_MICROPHONE_ID:
      return { ...state, microphoneID: payload.microphoneID };
    case DEVICE.SET_SPEAKER_ID:
      return { ...state, speakerID: payload.speakerID };
    case DEVICE.SET_SETUP_COMPLETED:
      return { ...state, isSetupComplete: true };
    case DEVICE.TOGGLE_CAMERA_ON:
      return { ...state, isCameraOn: !state.isCameraOn };
    case DEVICE.TOGGLE_MIC_ON:
      return { ...state, isMicOn: !state.isMicOn };
    case DEVICE.UNSET_SETUP_COMPLETED:
      return { ...initState, isSetupComplete: false };
    default:
      return state;
  }
};
export default DeviceReducer;
