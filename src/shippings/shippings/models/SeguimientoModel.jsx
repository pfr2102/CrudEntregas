import { getDetailRow } from "../helpers/Utils";

export function SeguimientoModel() {
    let Seguimiento = {
        Ubicacion: { type: String },
        DesUbicacion: { type: String },
        Referencias: { type: String },
        Observacion: { type: String },
        FechaReg: { type: Date },
        UsuarioReg: { type: String },
    };
    return Seguimiento
};
