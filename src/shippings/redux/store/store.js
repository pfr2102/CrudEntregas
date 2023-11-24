import { configureStore } from "@reduxjs/toolkit";
import shippingsSlice from "../slices/shippingsSlice";
//import productosSlice from "../slices/usuarios/productosSlice";
const store = configureStore({
    reducer: {
      shippingsReducer: shippingsSlice,
      //productosSliceReducer: productosSlice,
    },
  });
 
export default store;
