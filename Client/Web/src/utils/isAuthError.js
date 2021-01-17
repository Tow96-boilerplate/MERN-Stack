/** isAuthError 
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 * 
 * This function checks if a given error was created due to an authentication error
 * Since the AuthService uses the catch error, it inetivabily trickles down all
 * catch blocks. It's intended to avoid the react state update Warning as the logout
 * is performed earlier.
*/
import checkNested from './checkNested';

const isAuthError = (err) => {
  
  if(checkNested(err, 'response', 'data', 'errors', 'refreshToken')) return true;

  if(checkNested(err, 'response','data', 'errors', 'header')) return true;
  
  return false;
}

export default isAuthError;
