import { LOGIN } from "../types";

const initState = {
  roomId: null,
  username: null,
  secureRoom: false,
  joinLink: null,
  isLoggedIn: false,
};

const LoginReducer = (state = initState, { type, payload = {} }) => {
  switch (type) {
    case LOGIN.LOGIN_USER:
      return {
        ...state,
        roomId: payload.roomId,
        username: payload.username,
        secureRoom: payload.secureRoom,
        joinLink: payload.joinLink,
        isLoggedIn: payload.isLoggedIn,
      };
    case LOGIN.LOGOUT_USER:
      return initState;
    case LOGIN.GET_LOGIN_DATA:
      return state;
    case LOGIN.GET_USER_NAME:
      return state.username;
    case LOGIN.GET_JOIN_LINK:
      return state.joinLink;
    case LOGIN.SET_LOGGED_IN:
      return { ...state, isLoggedIn: true };
    default:
      return state;
  }
};
export default LoginReducer;
