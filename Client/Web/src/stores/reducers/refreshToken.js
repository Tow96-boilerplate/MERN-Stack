const initialState = { token: null, keepSession: false };

// Delete token if expired commented as sending the expired token to the server will 
// delete it from it's database and log out, which is better
/*if (localStorage.getItem('refToken')) {
  const decodedToken = jwtDecode(localStorage.getItem('refToken'));

  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem('refToken');
  } else {
    initialState.token = localStorage.getItem('refToken');
  }
};*/

if (sessionStorage.getItem('refToken')) { initialState.token = sessionStorage.getItem('refToken'); }
else if (localStorage.getItem('refToken')) { initialState.token = localStorage.getItem('refToken'); }

const refreshTokenReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      // If no payload, return;
      if (!action.payload.refToken) return state;
      
      // Stores the token in the session storage
      sessionStorage.setItem('refToken', action.payload.refToken);

      // If keepSession is enabled Stores the token in the localStorage
      if (action.payload.keepSession) localStorage.setItem('refToken', action.payload.refToken);

      return {
        ...state,
        token: action.payload.refToken
      }
    case 'LOGOUT':
      // Removes token from localStorage
      localStorage.removeItem('refToken');
      sessionStorage.removeItem('refToken');
      return {
        ...state,
        token: null,
      }
    default:
      return state;
  }
};

export default refreshTokenReducer;
