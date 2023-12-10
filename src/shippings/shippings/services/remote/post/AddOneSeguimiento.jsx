import axios from "axios";

export function AddOneSeguimiento(shippingId, idInstituto, idNegocio, idDomiclio, Seguimiento) {
    console.log("<<EJECUTA>> API <<AddOneProducto>> Requiere:", Seguimiento);
    return new Promise((resolve, reject) => {
        const queryParams = `?IdEntregaOK=${shippingId}&IdInstitutoOK=${idInstituto}&IdNegocioOK=${idNegocio}&IdDomicilioOK=${idDomiclio}`;
        axios.post(`http://localhost:3020/api/pwa/shipping/subdocumentESe/${queryParams}`, Seguimiento)
            .then((response) => {
                console.log("<<RESPONSE>> AddOneProducto", Seguimiento);
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
