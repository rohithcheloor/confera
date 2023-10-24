import { DEVICE } from "../types";

const initState = {
  cameraID: null,
  microphoneID: null,
  speakerID: null,
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
    default:
      return state;
  }
};
export default DeviceReducer;
