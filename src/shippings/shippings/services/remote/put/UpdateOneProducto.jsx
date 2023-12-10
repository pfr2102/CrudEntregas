import axios from "axios";

export function UpdateOneProducto(Producto, idInstitutoOK, idNegocioOK, idEntregaOK, idDomicilio, idPresentaOK) {
    console.log("<<EJECUTA>> API <<UpdateOneShipping>> Requiere:", Producto);
    return new Promise((resolve, reject) => {
        axios.put(`http://localhost:3020/api/pwa/shipping/subdocumentEPr/?IdInstitutoOK=${idInstitutoOK}&IdNegocioOK=${idNegocioOK}&IdEntregaOK=${idEntregaOK}&IdPresentaOK=${idPresentaOK}&IdDomicilioOK=${idDomicilio}`, Producto)
            .then((response) => {
                console.log("<<RESPONSE>> UpdateOneShipping", Producto);
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