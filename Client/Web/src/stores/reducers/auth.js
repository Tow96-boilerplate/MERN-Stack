import jwtDecode from 'jwt-decode';

const authReducer = (state = { user: null }, action) => {
  switch (action.type) {
    case 'LOGIN':
      const { user } = jwtDecode(action.payload.authToken);
      return {
        ...state,
        user: user,
        token: action.payload.authToken,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
      };
    case 'CHANGE-USERNAME':
      return {
        ...state,
        user: {
          ...state.user,
          username: action.payload,
        },
      }

    case 'CHANGE-EMAIL':
      return {
        ...state,
        user: {
          ...state.user,
          email: action.payload,
          emailConfirmed: false,
        }
      }
    default:
      return state;
  }
};

export default authReducer;
