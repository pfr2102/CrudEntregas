import axios from "axios";

export function UpdateOneEnvio(EnvioSubdocument, idInstitutoOK, idNegocioOK, idEntregaOK, idDomicilioOK) {
    console.log("<<EJECUTA>> API <<UpdateOneShipping>> Requiere:", EnvioSubdocument);
    return new Promise((resolve, reject) => {
        axios.put(`http://localhost:3020/api/pwa/shipping/subdocumentE/?IdInstitutoOK=${idInstitutoOK}&IdNegocioOK=${idNegocioOK}&IdEntregaOK=${idEntregaOK}&IdDomicilioOK=${idDomicilioOK}`, EnvioSubdocument)
            .then((response) => {
                console.log("<<RESPONSE>> UpdateOneShipping", EnvioSubdocument);
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
