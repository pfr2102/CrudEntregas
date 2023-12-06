import axios from "axios";

export function updateOneInfoAd(shippingId, subdocumentId, updatedData) {
    console.log("<<EJECUTA>> API <<UpdateOneInfoAd>> Requiere:", updatedData);
    return new Promise((resolve, reject) => {
        axios.put(`http://localhost:3020/api/pwa/shipping/${shippingId}/${subdocumentId}`, updatedData)
            .then((response) => {
                console.log("<<RESPONSE>> UpdateOneInfoAd", updatedData);
                const data = response.data;
                if (!data.success) {
                    console.error("<<ERROR>> <<NO>> se ejecutó la API <<UpdateOneInfoAd>> de forma correcta", data);
                    reject(data);
                } else if (data.success) {
                    resolve(data);
                }
            })
            .catch((error) => {
                console.error("<<ERROR>> en API <<UpdateOneInfoAd>>", error);
                reject(error);
            });
    });
}