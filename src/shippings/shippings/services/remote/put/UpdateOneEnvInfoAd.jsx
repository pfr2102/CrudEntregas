import axios from "axios";
import { getDetailRowReg } from "../../../helpers/Utils";

export function UpdateOneEnvInfoAd(InfoAd, idInstitutoOK, idNegocioOK, idEntregaOK, idDomicilio, idEtiquetaOK) {
    console.log("<<EJECUTA>> API <<UpdateOneShipping>> Requiere:", InfoAd);
    return new Promise((resolve, reject) => {
        // Obtener el detalle actual
        const currentDetailRow = InfoAd.detail_row;

        // Crear un nuevo registro para detail_row_reg
        const newDetailRowReg = getDetailRowReg();

        // Agregar el nuevo registro al detalle actual
        currentDetailRow.detail_row_reg.push(newDetailRowReg);

        // Actualizar el campo detail_row en InfoAd
        InfoAd.detail_row = currentDetailRow;

        axios.put(`${import.meta.env.VITE_SHIPPINGS_URL}/subdocumentEInf/?IdInstitutoOK=${idInstitutoOK}&IdNegocioOK=${idNegocioOK}&IdEntregaOK=${idEntregaOK}&IdEtiquetaOK=${idEtiquetaOK}&IdDomicilioOK=${idDomicilio}`, InfoAd)
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