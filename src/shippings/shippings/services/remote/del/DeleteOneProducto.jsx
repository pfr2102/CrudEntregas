import axios from "axios";

export function DeleteOneProducto(IdInstitutoOK, IdNegocioOK, IdEntregaOK, IdDomicilioOK, IdPresentaOK) {
    console.log("<<EJECUTA>> API <<deleteShipping>> Requiere ID:", IdPresentaOK);
    return new Promise((resolve, reject) => {
        axios.delete(`http://localhost:3020/api/pwa/shipping/subdocumentEPr/?IdInstitutoOK=${IdInstitutoOK}&IdNegocioOK=${IdNegocioOK}&IdEntregaOK=${IdEntregaOK}&IdPresentaOK=${IdPresentaOK}&IdDomicilioOK=${IdDomicilioOK}`)
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
