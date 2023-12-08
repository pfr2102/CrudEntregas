import { getDetailRow } from "../helpers/Utils";

export function EnviosModel() {
    let Envios = {
        IdDomicilioOK: { type: String },
        IdPaqueteriaOK: { type: String },
        IdTipoMetodoEnvio: { type: String },
        CostoEnvio: { type: Number },
        info_ad: [],
        productos: [],
        estatus: [],
        rastreos: []
    };
    return Envios
};
