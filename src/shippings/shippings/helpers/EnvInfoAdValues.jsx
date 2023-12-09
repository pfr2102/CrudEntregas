import { EnvInfoAdModel } from "../models/EnvInfoAdModel"

//FIC: obtiene los valores capturados en la ventana modal
//enviados desde el evento onSubmit de Formik
export const EnvInfoAdValues = (values)=>{
  let EnvInfoAd =  EnvInfoAdModel()
  EnvInfoAd.IdEtiquetaOK=values.IdEtiquetaOK,
  EnvInfoAd.IdEtiqueta=values.IdEtiqueta,
  EnvInfoAd.Etiqueta=values.Etiqueta,
  EnvInfoAd.Valor=values.Valor,
  EnvInfoAd.IdTipoSeccionOK=values.IdTipoSeccionOK,
  EnvInfoAd.Secuencia=values.Secuencia
  return EnvInfoAd
}
