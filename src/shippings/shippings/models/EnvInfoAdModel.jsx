import { getDetailRow } from "../helpers/Utils";

export function EnvInfoAdModel() {
    let EnvInfoAd = {
        IdEtiquetaOK: { type: String },
        IdEtiqueta: { type: String },
        Etiqueta: { type: String },
        Valor: { type: String },
        IdTipoSeccionOK: { type: String },
        Secuencia: { type: Number },
        detail_row: getDetailRow(),
    };
    return EnvInfoAd
};
