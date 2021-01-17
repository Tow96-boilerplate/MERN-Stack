/**checkNested.js
 * Function obtained from:
 * https://stackoverflow.com/questions/2631001/test-for-existence-of-nested-javascript-object-key
 *
 * checks an object for the existance of a nested key without throwing errors
 * e.g. (
 *  foo = {level1: {level2: {level3: 'bar'}}}
 *  
 *  if( foo.level1.level2.foo) returns exception
 *  checkNested(foo, 'level1', 'level2', 'foo') returns false
 * )
 */

function checkNested(obj, level, ...rest) {
  if(obj === undefined) return false;
  if(rest.length === 0 && obj.hasOwnProperty(level)) return true;
  return checkNested(obj[level], ...rest);
}

export default checkNested;
