import { getDetailRow } from "../helpers/Utils";
import { ProductosModel } from "./ProductosModel";

export function EnviosModel() {
    let Envios = {
        IdDomicilioOK: { type: String },
        IdPaqueteriaOK: { type: String },
        IdTipoMetodoEnvio: { type: String },
        CostoEnvio: { type: Number },
        info_ad: [],
        productos: [ProductosModel],
        estatus: [],
        rastreos: {},
    };
    return Envios;
}
