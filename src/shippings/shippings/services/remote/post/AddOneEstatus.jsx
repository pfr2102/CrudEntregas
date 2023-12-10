import axios from "axios";

export function AddOneEstatus(shippingId, idInstituto, idNegocio, idDomiclio, Estatus) {
    console.log("<<EJECUTA>> API <<AddOneProducto>> Requiere:", Estatus);
    return new Promise((resolve, reject) => {
        const queryParams = `?IdEntregaOK=${shippingId}&IdInstitutoOK=${idInstituto}&IdNegocioOK=${idNegocio}&IdDomicilioOK=${idDomiclio}`;
        axios.post(`http://localhost:3020/api/pwa/shipping/subdocumentESt/${queryParams}`, Estatus)
            .then((response) => {
                console.log("<<RESPONSE>> AddOneProducto", Estatus);
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
