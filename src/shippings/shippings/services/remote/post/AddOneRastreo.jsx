import axios from "axios";

export function AddOneRastreo(shippingId, idInstituto, idNegocio, idDomiclio, Rastreo) {
    console.log("<<EJECUTA>> API <<AddOneProducto>> Requiere:", Rastreo);
    return new Promise((resolve, reject) => {
        const queryParams = `?IdEntregaOK=${shippingId}&IdInstitutoOK=${idInstituto}&IdNegocioOK=${idNegocio}&IdDomicilioOK=${idDomiclio}`;
        axios.post(`http://localhost:3020/api/pwa/shipping/subdocumentERa/${queryParams}`, Rastreo)
            .then((response) => {
                console.log("<<RESPONSE>> AddOneProducto", Rastreo);
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
