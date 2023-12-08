import { EnviosModel } from "../models/EnviosModel"

//FIC: obtiene los valores capturados en la ventana modal
//enviados desde el evento onSubmit de Formik
export const EnviosValues = (values)=>{
  let Envios =  EnviosModel()
  Envios.IdDomicilioOK=values.IdDomicilioOK,
  Envios.IdPaqueteriaOK=values.IdPaqueteriaOK,
  Envios.IdTipoMetodoEnvio=values.IdTipoMetodoEnvio,
  Envios.CostoEnvio=values.CostoEnvio
  return Envios
}
