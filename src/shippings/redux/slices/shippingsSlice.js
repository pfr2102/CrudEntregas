import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    //DATA
shippingsDataArr: [],
 
  //SELECCIONES
  //instituteDataObj: {},
    //BOOLEANS/VARIABLES
}
const shippingsSlice = createSlice({
name: 'SHIPPINGS',
initialState,
reducers: {
SET_DATA_SHIPPINGS: (state, action) => {
                        console.log('<<REDUX-REDUCER>>:<<SET_DATA_SHIPPINGS>>', action.payload);

state.shippingsDataArr = action.payload
}
    }
}
);
export const {
SET_DATA_SHIPPINGS,
    //ADD_PRODUCT_SELECTED,
    //SWITCH_STATE,
} = shippingsSlice.actions;
export default shippingsSlice.reducer;
