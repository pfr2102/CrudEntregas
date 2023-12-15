import axios from "axios";

export function UpdateAllEstatus(shippingId, idInstituto, idNegocio, idDomiclio, updateInfo) {
    console.log("<<EJECUTA>> API <<UpdateAllEstatus>> Requiere:", updateInfo);
    return new Promise((resolve, reject) => {
        const queryParams = `?IdEntregaOK=${shippingId}&IdInstitutoOK=${idInstituto}&IdNegocioOK=${idNegocio}&IdDomicilioOK=${idDomiclio}`;
        axios.put(`http://localhost:3020/api/pwa/shipping/updateAllEstatus/${queryParams}`, updateInfo)
            .then((response) => {
                console.log("<<RESPONSE>> UpdateAllEstatus", updateInfo);
                const data = response.data;
                if (!data.success) {
                    console.error("<<ERROR>> <<NO>> se ejecutó la API <<UpdateAllEstatus>> de forma correcta", data);
                    reject(data);
                } else if (data.success) {
                    resolve(data);
                }
            })
            .catch((error) => {
                console.error("<<ERROR>> en API <<UpdateAllEstatus>>", error);
                reject(error);
            });
    });
}
