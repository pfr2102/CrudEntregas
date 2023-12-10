import { getDetailRow } from "../helpers/Utils";

export function RastreosModel() {
    let Rastreos = {
        NumeroGuia: { type: String },
        IdRepartidorOK: { type: String },
        NombreRepartidor: { type: String },
        Alias: { type: String },
        seguimiento: [],
    };
    return Rastreos
};
