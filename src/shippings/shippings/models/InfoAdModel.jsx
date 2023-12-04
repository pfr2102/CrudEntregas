import { getDetailRow } from "../helpers/Utils";

export function InfoAdModel() {
    let InfoAd = {
        IdEtiquetaOK: { type: String },
        IdEtiqueta: { type: String },
        Etiqueta: { type: String },
        Valor: { type: String },
        IdTipoSeccionOK: { type: String },
        Secuencia: { type: Number },
        detail_row: getDetailRow(),
    };
    return InfoAd
};
