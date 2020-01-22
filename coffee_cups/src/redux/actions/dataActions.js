import { SET_CUPS, LOADING_DATA, LIKE_CUP, UNLIKE_CUP } from '../types';
import axios from 'axios';

// Get all cups
export const getCups = () => dispatch => {
  dispatch({ type: LOADING_DATA });
  axios
    .get('/cups')
    .then(res => {
      dispatch({
        type: SET_CUPS,
        payload: res.data
      });
    })
    .catch(err => {
      console.log(err);
    });
};

// Like a cup
export const likeCup = cupId => dispatch => {
  axios
    .get(`/cup/${cupId}/like`)
    .then(res => {
      dispatch({
        type: LIKE_CUP,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};

// Unlike a cup
export const unlikeCup = cupId => dispatch => {
  axios
    .get(`/cup/${cupId}/unlike`)
    .then(res => {
      dispatch({
        type: UNLIKE_CUP,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};
