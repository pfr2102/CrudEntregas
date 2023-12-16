import axios from "axios";

export function AddOneEnvio(shippingId, idInstituto, idNegocio, Envio) {
    console.log("<<EJECUTA>> API <<AddOneInfoAd>> Requiere:", Envio);
    return new Promise((resolve, reject) => {
        const queryParams = `?IdEntregaOK=${shippingId}&IdInstitutoOK=${idInstituto}&IdNegocioOK=${idNegocio}`;
        axios.post(`${import.meta.env.VITE_SHIPPINGS_URL}/subdocumentE/${queryParams}`, Envio)
            .then((response) => {
                console.log("<<RESPONSE>> AddOneInfoAd", Envio);
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
