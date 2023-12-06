import axios from "axios";

export function AddOneInfoAd(shippingId, idInstituto, idNegocio, shipping, subdocument) {
    console.log("<<EJECUTA>> API <<AddOneInfoAd>> Requiere:", shipping);
    return new Promise((resolve, reject) => {
        const queryParams = `?IdEntregaOK=${shippingId}&IdInstitutoOK=${idInstituto}&IdNegocioOK=${idNegocio}`;
        axios.post(`http://localhost:3020/api/pwa/shipping/subdocument/${queryParams}`, { ...shipping, info_ad: subdocument })
            .then((response) => {
                console.log("<<RESPONSE>> AddOneInfoAd", shipping);
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

//PONGO COMENTARIO ACA PORQUE SI NO NO CABE (TODO ESTO VA ENFOCADO EN LA LINEA 6 DEL CODIGO)
//EN ESPECIFICO LA PARTE DE: { ...shipping, info_ad: subdocument }
//1.
//"{...shipping}" usa la sintaxis de propagación "..." para copiar todas las propiedades del objeto shipping
//basicamente crea una copia "superficial" de shipping
//2.
//"info_ad: subdocument" Agrega la propiedad info_ad al nuevo objeto y le asigna el valor de subdocument implicando que
//subdocument contiene algun tipo de información adicional en relación con el envío (shipping)

//BASICAMENTE: TODA LA LINEA ESA DE { ...shipping, info_ad: subdocument } ES UNA FORMA EN CODIGO DE VER ESTO PERO EN POSTMAN:
// {
//     "info_ad": [
//         {
//             "IdEtiquetaOK":"Valor"
//             "IdEtiqueta":"Valor"
//             "Etiqueta":"Valor"
//             "Valor":"Valor"
//             "IdTipoSeccion":"Valor"
//             "Secuencia": Numero
//         }
//     ]
// }
