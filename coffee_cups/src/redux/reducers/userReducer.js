import { SET_USER, SET_AUTHONTICATED, SET_UNAUTHANTICATED } from '../types';

const initialState = {
  authenticated: false,
  credentials: {},
  likes: [],
  notofications: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_AUTHONTICATED:
      return { ...state, authenticated: true };
    case SET_UNAUTHANTICATED:
      return initialState;
    case SET_USER:
      return { authenticated: true, ...action.payload };
    default:
      return state;
  }
}
