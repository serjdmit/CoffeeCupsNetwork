import { SET_CUPS, LIKE_CUP, UNLIKE_CUP, LOADING_DATA } from '../types';

const initialState = {
  cups: [],
  cup: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true
      };
    case SET_CUPS:
      return {
        ...state,
        cups: action.payload,
        loading: false
      };
    case LIKE_CUP:
    case UNLIKE_CUP:
      let index = state.cups.findIndex(
        cup => cup.cupId === action.payload.cupId
      );
      state.cups[index] = action.payload;
      return {
        ...state
      };
    default:
      return state;
  }
}
