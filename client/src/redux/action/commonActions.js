import { COMMON } from "../types";

export const setLoading = () => {
  return { type: COMMON.SET_LOADING };
};
export const unsetLoading = () => {
  return { type: COMMON.UNSET_LOADING };
};
export const setOrgName = (orgName) => {
  const payload = { orgName };
  return { type: COMMON.SET_ORG_NAME, payload };
};
export const setOrgLogo = (orgLogo) => {
  const payload = { orgLogo };
  return { type: COMMON.SET_ORG_LOGO, payload };
};

export const setMobileDevice = () => {
  return { type: COMMON.SET_MOBILE };
};
