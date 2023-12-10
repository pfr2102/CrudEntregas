import { RastreosModel } from "../models/RastreosModel"

//FIC: obtiene los valores capturados en la ventana modal
//enviados desde el evento onSubmit de Formik
export const RastreosValues = (values)=>{
  let Rastreos =  RastreosModel()
  Rastreos.NumeroGuia=values.NumeroGuia,
  Rastreos.IdRepartidorOK=values.IdRepartidorOK,
  Rastreos.NombreRepartidor=values.NombreRepartidor,
  Rastreos.Alias=values.Alias
  return Rastreos
}
