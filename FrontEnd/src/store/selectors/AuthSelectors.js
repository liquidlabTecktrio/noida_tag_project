export const isAuthenticated = (state) => {
    // if ( window.localStorage.getItem("username")!=undefined) return true;
    if (state.auth.auth.idToken) return true;
    // if ( window.localStorage.getItem("username")) return true; //checking purfose praveen created
    return false;
};
