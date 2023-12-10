import { EstatusModel } from "../models/EstatusModel"

//FIC: obtiene los valores capturados en la ventana modal
//enviados desde el evento onSubmit de Formik
export const EstatusValues = (values)=>{
  let Productos =  EstatusModel()
  Productos.IdTipoEstatusOK=values.IdTipoEstatusOK,
  Productos.Actual=values.Actual,
  Productos.Observacion=values.Observacion
  return Productos
}
