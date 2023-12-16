import axios from "axios";

export function DeleteOneEnvInfoAd(IdInstitutoOK, IdNegocioOK, IdEntregaOK, IdDomicilioOK, IdEtiquetaOK) {
    console.log("<<EJECUTA>> API <<deleteShipping>> Requiere ID:", IdEtiquetaOK);
    return new Promise((resolve, reject) => {
        axios.delete(`${import.meta.env.VITE_SHIPPINGS_URL}/subdocumentEInf/?IdInstitutoOK=${IdInstitutoOK}&IdNegocioOK=${IdNegocioOK}&IdEntregaOK=${IdEntregaOK}&IdEtiquetaOK=${IdEtiquetaOK}&IdDomicilioOK=${IdDomicilioOK}`)
        .then((response) => {
            console.log("<<RESPONSE>> DeleteOneShipping", response.data);
            const data = response.data;
            if (!data.success) {
                console.error(
                    "<<ERROR>> <<NO>> se ejecutó la API <<DeleteOneShipping>> de forma correcta",
                    data
                );
                reject(data);
            } else if (data.success) {
                resolve(data);
            }
        })
        .catch((error) => {
            console.error("<<ERROR>> en API <<DeleteOneShipping>>", error);
            reject(error);
        });
    });
}
