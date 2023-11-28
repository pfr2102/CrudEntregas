import axios from "axios";

export function UpdateOneShipping(shipping, id) {
    console.log("<<EJECUTA>> API <<UpdateOneShipping>> Requiere:", shipping);
    return new Promise((resolve, reject) => {
        axios.put(`http://localhost:3020/api/pwa/shipping/${id}`, shipping)
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
