export const getUrl = (state) => state.ui.urlHistory[state.ui.urlHistory.length - 1];
export const getUserId = (state) => state.auth.uid;
export const getIsLoggedIn = (state) => state.auth.isLoggedIn;
