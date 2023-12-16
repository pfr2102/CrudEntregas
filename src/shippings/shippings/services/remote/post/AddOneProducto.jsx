import axios from "axios";

export function AddOneProducto(shippingId, idInstituto, idNegocio, idDomiclio, Producto) {
    console.log("<<EJECUTA>> API <<AddOneProducto>> Requiere:", Producto);
    return new Promise((resolve, reject) => {
        const queryParams = `?IdEntregaOK=${shippingId}&IdInstitutoOK=${idInstituto}&IdNegocioOK=${idNegocio}&IdDomicilioOK=${idDomiclio}`;
        axios.post(`${import.meta.env.VITE_SHIPPINGS_URL}/subdocumentEPr/${queryParams}`, Producto)
            .then((response) => {
                console.log("<<RESPONSE>> AddOneProducto", Producto);
                const data = response.data;
                if (!data.success) {
                    console.error("<<ERROR>> <<NO>> se ejecutó la API <<AddOneProducto>> de forma correcta", data);
                    reject(data);
                } else if (data.success) {
                    resolve(data);
                }
            })
            .catch((error) => {
                console.error("<<ERROR>> en API <<AddOneProducto>>", error);
                reject(error);
            });
    });
}
