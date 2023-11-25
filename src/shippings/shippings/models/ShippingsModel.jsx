export function ShippingsModel() {
    let Shipping = {
        id_ordenOK: { type: String },
        id_domicilioOK: { type: String },
        id_proveedorOK: { type: String },
        usuario: [],
        envio: [],
        empresa_logistica: [],
        rastreo: [],
        devolucion: [],
    };
    return Shipping
};
//Checar nota 6.9 punto 5
//Queda pendiente hacer archivo Utils.jsx para saber que partes de la estructura se pueden asignar por default