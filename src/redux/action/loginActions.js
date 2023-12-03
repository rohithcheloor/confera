import { LOGIN } from "../types";

export const LoginUser = (
  roomId,
  username,
  password,
  secureRoom,
  joinLink,
  isLoggedIn
) => {
  if (joinLink && joinLink.toString().trim() !== "") {
    joinLink = window.location.origin + "/join-with-link/" + joinLink;
  }
  const payload = { roomId, username,password, secureRoom, joinLink, isLoggedIn };
  return { type: LOGIN.LOGIN_USER, payload };
};
export const LogoutUser = () => {
  return { type: LOGIN.LOGOUT_USER };
};

export const setLoggedIn = () => {
  return { type: LOGIN.SET_LOGGED_IN };
};
export const setPassword = (password) => {
  return { type: LOGIN.SET_LOGGED_IN, payload: { password } };
};

export const getLoginData = () => {
  return { type: LOGIN.GET_LOGIN_DATA };
};

export const getJoinLink = () => {
  return { type: LOGIN.GET_JOIN_LINK };
};

export const getUsername = () => {
  return { type: LOGIN.GET_USER_NAME };
};
