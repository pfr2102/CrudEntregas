import axios from "axios";

export function AddOneEnvInfoAd(shippingId, idInstituto, idNegocio, idDomiclio, InfoAd) {
    console.log("<<EJECUTA>> API <<AddOneInfoAd>> Requiere:", InfoAd);
    return new Promise((resolve, reject) => {
        const queryParams = `?IdEntregaOK=${shippingId}&IdInstitutoOK=${idInstituto}&IdNegocioOK=${idNegocio}&IdDomicilioOK=${idDomiclio}`;
        axios.post(`http://localhost:3020/api/pwa/shipping/subdocumentEInf/${queryParams}`, InfoAd)
            .then((response) => {
                console.log("<<RESPONSE>> AddOneInfoAd", InfoAd);
                const data = response.data;
                if (!data.success) {
                    console.error("<<ERROR>> <<NO>> se ejecutó la API <<AddOneInfoAd>> de forma correcta", data);
                    reject(data);
                } else if (data.success) {
                    resolve(data);
                }
            })
            .catch((error) => {
                console.error("<<ERROR>> en API <<AddOneInfoAd>>", error);
                reject(error);
            });
    });
}
