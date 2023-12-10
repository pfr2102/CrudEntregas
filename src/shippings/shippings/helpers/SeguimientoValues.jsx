import { SeguimientoModel } from "../models/SeguimientoModel"

//FIC: obtiene los valores capturados en la ventana modal
//enviados desde el evento onSubmit de Formik
export const SeguimientoValues = (values)=>{
  let Seguimiento =  SeguimientoModel()
  Seguimiento.Ubicacion=values.Ubicacion,
  Seguimiento.DesUbicacion=values.DesUbicacion,
  Seguimiento.Referencias=values.Referencias,
  Seguimiento.Observacion=values.Observacion,
  Seguimiento.FechaReg=values.FechaReg,
  Seguimiento.UsuarioReg=values.UsuarioReg
  return Seguimiento
}
