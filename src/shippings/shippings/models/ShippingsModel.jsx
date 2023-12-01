export function ShippingsModel() {
    let Shipping = {
        IdEntregaOK: { type: String },
        IdEntregaBK: { type: String },
        IdOrdenOK: { type: String },
        info_ad: [],
        envios: []
    };
    return Shipping
};
//Checar nota 6.9 punto 5
//Queda pendiente hacer archivo Utils.jsx para saber que partes de la estructura se pueden asignar por default