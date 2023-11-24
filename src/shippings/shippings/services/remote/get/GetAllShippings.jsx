import axios from "axios";
export function getAllShippings() {
    return new Promise((resolve, reject) => {
      //FIC: http://localhost:8080/api/pwa/institutes 
      axios.get(`http://localhost:3020/api/pwa/shipping`)
        .then((response) => {
          const data = response.data;
        // console.log("getProducts()", data);
 
          if (!data.success) {
            console.error("No se pudo realizar correctamente la petición <<getAllShippings - Services>>", data);
            reject(data); // Rechaza la promesa con la respuesta si no fue exitosa
          } else if (data.data.length === 0) {
            console.info("🛈 No se encontraron documentos en <<Shippings>>");
            resolve([]);
          } else if (data.success) {
            const ShippingsData = data.data[0].dataRes;
            console.log("Colección: <<Shippings>>", ShippingsData);
            resolve(JSON.parse(JSON.stringify(ShippingsData))); // Resuelve la promesa y hace una copia profunda
          }
        })
        .catch((error) => {
          console.error("Error en <<getAllShippings - Services>>", error);
          reject(error); // Rechaza la promesa en caso de error
        });
    });
}
