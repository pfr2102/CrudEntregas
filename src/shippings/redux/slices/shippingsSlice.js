import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    //DATA
shippingsDataArr: [],
selectedShippingData: null, //PARA LOS DATOS DE SHIPPING
 
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
},
//================================================NUEVAS ACCIONES================================================
//Nueva acción para sacar los datos del documento completo de ShippingsTable y pasarlo a InfoAdTable con dispatch
SET_SELECTED_SHIPPING_DATA: (state, action) => {
    state.selectedShippingData = action.payload;
},
//Nueva acción para sacar los datos del documento completo de ShippingsTable y pasarlo a InfoAdTable con dispatch
SET_SELECTED_ENVIO_DATA: (state, action) => {
    state.selectedEnvioData = action.payload;
},
//================================================NUEVAS ACCIONES================================================s
    }
}
);
export const {
SET_DATA_SHIPPINGS,
SET_SELECTED_SHIPPING_DATA,
SET_SELECTED_ENVIO_DATA,
    //ADD_PRODUCT_SELECTED,
    //SWITCH_STATE,
} = shippingsSlice.actions;
export default shippingsSlice.reducer;
