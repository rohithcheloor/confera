import { COMMON } from "../types";

const initState = {
  loading: false,
  orgName: "",
  orgLogo: "",
  isMobile: false,
};

const CommonReducer = (state = initState, { type, payload = {} }) => {
  switch (type) {
    case COMMON.SET_LOADING:
      return {
        ...state,
        loading: true,
      };
    case COMMON.UNSET_LOADING:
      return {
        ...state,
        loading: false,
      };
    case COMMON.SET_ORG_NAME:
      return { ...state, orgName: payload.orgName };
    case COMMON.SET_ORG_LOGO:
      return { ...state, orgLogo: payload.orgLogo };
    case COMMON.SET_MOBILE:
      return { ...state, isMobile: true };
    default:
      return state;
  }
};

export default CommonReducer;
