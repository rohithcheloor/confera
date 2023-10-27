import { combineReducers } from "redux";
import LoginReducer from "./loginReducer";
import DeviceReducer from "./deviceReducer";
import CommonReducer from "./commonReducer";
const allReducers = combineReducers({
    login: LoginReducer,
    devices: DeviceReducer,
    common: CommonReducer,
});

const rootReducer = (state, action) => {
    let newState = { ...state };
    return allReducers(newState, action);
};

export default rootReducer;