import axios from "axios";

export function DeleteOneShipping(id) {
    console.log("<<EJECUTA>> API <<deleteShipping>> Requiere ID:", id);
    return new Promise((resolve, reject) => {
        axios.delete(`http://localhost:3020/api/pwa/shipping/${id}`)
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
