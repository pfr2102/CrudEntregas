import axios from "axios";

export function AddOneShipping(shipping) {
   
    console.log("<<EJECUTA>> API <<AddOneShipping>> Requiere:", shipping)
    return new Promise((resolve, reject) => {
      axios.post(`http://localhost:3020/api/pwa/shipping`, shipping)
        .then((response) => {
          console.log("<<RESPONSE>> AddOneShipping", shipping)
          const data = response.data;
          if (!data.success) { 
            console.error("<<ERROR>> <<NO>> se ejecuto la API <<AddOneShipping>> de forma correcta", data);
            reject(data);
          } else if (data.success) {
            resolve(data);
          }
        })
        .catch((error) => {
          console.error("<<ERROR>> en API <<AddOneShipping>>", error);
          reject(error);
        });   
    });
}
