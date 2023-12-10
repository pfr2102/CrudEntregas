import { ProductosModel } from "../models/ProductosModel"

//FIC: obtiene los valores capturados en la ventana modal
//enviados desde el evento onSubmit de Formik
export const ProductosValues = (values)=>{
  let Productos =  ProductosModel()
  Productos.IdProdServOK=values.IdProdServOK,
  Productos.IdPresentaOK=values.IdPresentaOK,
  Productos.DesProdServ=values.DesProdServ,
  Productos.DesPresenta=values.DesPresenta,
  Productos.CantidadPed=values.CantidadPed,
  Productos.CantidadEnt=values.CantidadEnt
  return Productos
}
