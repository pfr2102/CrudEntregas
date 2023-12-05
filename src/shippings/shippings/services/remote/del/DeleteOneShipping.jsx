import axios from "axios";

export function DeleteOneShipping(IdInstitutoOK, IdNegocioOK, IdEntregaOK) {
    console.log("<<EJECUTA>> API <<deleteShipping>> Requiere ID:", IdEntregaOK);
    return new Promise((resolve, reject) => {
        axios.delete(`http://localhost:3020/api/pwa/shipping/?IdInstitutoOK=${IdInstitutoOK}&IdNegocioOK=${IdNegocioOK}&IdEntregaOK=${IdEntregaOK}`)
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
