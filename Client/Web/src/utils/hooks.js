/** hooks.js
 * Copyright (c) 2020, Jose Tow
 * All rights reserved.
 * 
 * Hooks for repetitive elements/components
 */
import { useState } from "react"

/** useForm
 * Contains the hooks and callbacks for the state of the elements of a form
 * 
 * @param callback Function that will be executed when the form is submited
 * @param initialState The inputs of the form
 * 
 * @returns onChange   (event caller to update the values)
 * @returns onSubmit   (call the onSubmit function)
 * @returns values     (object with the read-only values for binding)
 * @returns loading    (State that indicates if the loading spinner should be shown)
 * @returns setLoading (Function that allows the loading state to be changed)
 */
export const useForm = (callback, initialState = {}) => {
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const onChange = (_, data) => {
    switch (data.type) {
      case 'checkbox':
        setValues({ ...values, [data.name]: data.checked })
        break;
      case 'text':
      case 'password':
        setValues({ ...values, [data.name]: data.value });
        break;
      default:
        console.log(`No onChange routine for type: ${data.type}`)
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    callback();
  };

  return {
    onChange,
    onSubmit,
    values,
    loading,
    setLoading,
  };

}

/** useList
 * Contains the hooks and callbacks for the state of an array of items, intended
 * to be used as a list
 * 
 * @param initialState The array
 * 
 * @returns values     (array with the read-only values for binding)
 * @returns append     (adds an element to the array)
 * @returns loading    (State that indicates if the loading spinner should be shown)
 * @returns setLoading (Function that allows the loading state to be changed)
 */
export const useList = (initialState = []) => {
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const append = (object) => {
    const nuArr = [...values, object];
    setValues(nuArr);
  };

  const appendMulti = (array) => {
    const nuArr = [...values, ...array];
    setValues(nuArr);
  }

  return {
    append,
    appendMulti,
    loading,
    setLoading,
    values,
  };
}
