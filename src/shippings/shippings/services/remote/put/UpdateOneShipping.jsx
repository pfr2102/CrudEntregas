import axios from "axios";
import { getDetailRowReg } from "../../../helpers/Utils";

export function UpdateOneShipping(shipping, idInstitutoOK, idNegocioOK, idEntregaOK) {
    console.log("<<EJECUTA>> API <<UpdateOneShipping>> Requiere:", shipping);
    return new Promise((resolve, reject) => {
        // Obtener el detalle actual
        const currentDetailRow = shipping.detail_row;

        // Crear un nuevo registro para detail_row_reg
        const newDetailRowReg = getDetailRowReg();

        // Agregar el nuevo registro al detalle actual
        currentDetailRow.detail_row_reg.push(newDetailRowReg);

        // Actualizar el campo detail_row en shipping
        shipping.detail_row = currentDetailRow;

        axios.put(`http://localhost:3020/api/pwa/shipping/?IdInstitutoOK=${idInstitutoOK}&IdNegocioOK=${idNegocioOK}&IdEntregaOK=${idEntregaOK}`, shipping)
            .then((response) => {
                console.log("<<RESPONSE>> UpdateOneShipping", shipping);
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
