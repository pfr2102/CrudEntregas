import { getDetailRow } from "../helpers/Utils";

export function ProductosModel() {
    let Productos = {
        IdProdServOK: { type: String },
        IdPresentaOK: { type: String },
        DesProdServ: { type: String },
        DesPresenta: { type: String },
        CantidadPed: { type: Number },
        CantidadEnt: { type: Number },
    };
    return Productos
};
