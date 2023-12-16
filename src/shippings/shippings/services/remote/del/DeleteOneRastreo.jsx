import axios from "axios";

export function DeleteOneRastreo(shippingId, idInstituto, idNegocio, idDomiclio, numeroGuia) {
    console.log("<<EJECUTA>> API <<DeleteOneRastreo>> Requiere:", numeroGuia);
    return new Promise((resolve, reject) => {
        const queryParams = `?IdEntregaOK=${shippingId}&IdInstitutoOK=${idInstituto}&IdNegocioOK=${idNegocio}&IdDomicilioOK=${idDomiclio}&NumeroGuia=${numeroGuia}`;
        axios.delete(`${import.meta.env.VITE_SHIPPINGS_URL}/subdocumentERa/${queryParams}`)
            .then((response) => {
                console.log("<<RESPONSE>> DeleteOneRastreo", numeroGuia);
                const data = response.data;
                if (!data.success) {
                    console.error("<<ERROR>> <<NO>> se ejecutó la API <<DeleteOneRastreo>> de forma correcta", data);
                    reject(data);
                } else if (data.success) {
                    resolve(data);
                }
            })
            .catch((error) => {
                console.error("<<ERROR>> en API <<DeleteOneRastreo>>", error);
                reject(error);
            });
    });
}
