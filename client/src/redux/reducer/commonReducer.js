import { COMMON } from "../types";

const initState = {
  loading: false,
  orgName: "",
  orgLogo: "",
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
    default:
      return state;
  }
};
export default CommonReducer;
