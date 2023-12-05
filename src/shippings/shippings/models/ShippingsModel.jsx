import { getDetailRow } from "../helpers/Utils";

export function ShippingsModel() {
    let Shipping = {
        IdInstitutoOK: { type: String },
        IdNegocioOK: { type: String },
        IdEntregaOK: { type: String },
        IdEntregaBK: { type: String },
        IdOrdenOK: { type: String },
        info_ad: [],
        envios: [],
        detail_row: getDetailRow(),
    };
    return Shipping
};
