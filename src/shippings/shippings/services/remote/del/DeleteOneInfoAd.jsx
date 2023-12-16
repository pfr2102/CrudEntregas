import axios from "axios";

export function DeleteOneInfoAd(IdInstitutoOK, IdNegocioOK, IdEntregaOK, IdEtiquetaOK) {
    console.log("<<EJECUTA>> API <<deleteShipping>> Requiere ID:", IdEtiquetaOK);
    return new Promise((resolve, reject) => {
        axios.delete(`${import.meta.env.VITE_SHIPPINGS_URL}/subdocument/?IdInstitutoOK=${IdInstitutoOK}&IdNegocioOK=${IdNegocioOK}&IdEntregaOK=${IdEntregaOK}&IdEtiquetaOK=${IdEtiquetaOK}`)
            .then((response) => {
                console.log("<<RESPONSE>> deleteShipping", response.data);
                const data = response.data;
                if (!data.success) {
                    console.error(
                        "<<ERROR>> <<NO>> se ejecutó la API <<deleteShipping>> de forma correcta",
                        data
                    );
                    reject(data);
                } else if (data.success) {
                    resolve(data);
                }
            })
            .catch((error) => {
                console.error("<<ERROR>> en API <<deleteShipping>>", error);
                reject(error);
            });
    });
}
