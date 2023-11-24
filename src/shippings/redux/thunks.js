//NOTA: Este archivo contiene funciones ASYNCRONAS
//que nos ayuda a obtener la respuesta del servidor
//y poder mandarla al SLICE y a su estado
import { getShippingsAll } from './actions/getShippingsAll';
import { SET_DATA_SHIPPINGS } from './slices/shippingsSlice';

export const GET_DATA_START = () => {
    return async (dispatch, getState) => {
        dispatch(
            SET_DATA_SHIPPINGS(
                //FIC: lo que esta comentado es para cuando se utiliza
                //un reducer que contedra un arreglo de colecciones
                //tal sera el caso como el de catalogos.
                //{
                    //institutesDataArr: await getInstitutesAll(),
                    await getShippingsAll(),  //aqui como en las demas que se llamen igual tienes que cambiar el nombre de las funciones
                //}
            )
        )
    };
};

