import axios from "axios";

export function AddOneInfoAd(shippingId, idInstituto, idNegocio, InfoAd) {
    console.log("<<EJECUTA>> API <<AddOneInfoAd>> Requiere:", InfoAd);
    return new Promise((resolve, reject) => {
        const queryParams = `?IdEntregaOK=${shippingId}&IdInstitutoOK=${idInstituto}&IdNegocioOK=${idNegocio}`;
        axios.post(`http://localhost:3020/api/pwa/shipping/subdocument/${queryParams}`, InfoAd)
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
