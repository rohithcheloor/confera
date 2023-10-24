import { combineReducers } from "redux";
import LoginReducer from "./loginReducer";
import DeviceReducer from "./deviceReducer";
const allReducers = combineReducers({
    login: LoginReducer,
    devices: DeviceReducer,
});

const rootReducer = (state, action) => {
    let newState = { ...state };
    return allReducers(newState, action);
};

export default rootReducer;