import axios from "axios";

export function UpdateOneInfoAd(InfoAd, idInstitutoOK, idNegocioOK, idEntregaOK, idEtiquetaOK) {
    console.log("<<EJECUTA>> API <<UpdateOneShipping>> Requiere:", InfoAd);
    return new Promise((resolve, reject) => {
        axios.put(`http://localhost:3020/api/pwa/shipping/subdocument/?IdInstitutoOK=${idInstitutoOK}&IdNegocioOK=${idNegocioOK}&IdEntregaOK=${idEntregaOK}&IdEtiquetaOK=${idEtiquetaOK}`, InfoAd)
            .then((response) => {
                console.log("<<RESPONSE>> UpdateOneShipping", InfoAd);
                const data = response.data;
                if (!data.success) {
                    console.error(
                        "<<ERROR>> <<NO>> se ejecutó la API <<UpdateOneShipping>> de forma correcta",
                        data
                    );
                    reject(data);
                } else if (data.success) {
                    resolve(data);
                }
            })
            .catch((error) => {
                console.error("<<ERROR>> en API <<UpdateOneShipping>>", error);
                reject(error);
            });
    });
}
