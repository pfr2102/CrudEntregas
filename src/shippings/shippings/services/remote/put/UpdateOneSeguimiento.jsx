import axios from "axios";

export function UpdateOneSeguimiento(Seguimiento, idInstitutoOK, idNegocioOK, idEntregaOK, idDomicilio, Ubicacion) {
    console.log("<<EJECUTA>> API <<UpdateOneShipping>> Requiere:", Seguimiento);
    return new Promise((resolve, reject) => {
        axios.put(`http://localhost:3020/api/pwa/shipping/subdocumentESe/?IdInstitutoOK=${idInstitutoOK}&IdNegocioOK=${idNegocioOK}&IdEntregaOK=${idEntregaOK}&Ubicacion=${Ubicacion}&IdDomicilioOK=${idDomicilio}`, Seguimiento)
            .then((response) => {
                console.log("<<RESPONSE>> UpdateOneShipping", Seguimiento);
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