import axios from "axios";

export function getOneShippingById(IdInstitutoOK, IdNegocioOK, IdEntregaOK) {
  return new Promise((resolve, reject) => {
    axios.get(`http://localhost:3020/api/pwa/shipping/one`, {
      params: {
        IdInstitutoOK,
        IdNegocioOK,
        IdEntregaOK
      }
    })
      .then((response) => {
        const data = response.data;

        if (!data.success) {
          console.error("No se pudo realizar correctamente la petición <<getOneShippingById - Services>>", data);
          reject(data);
        } else if (data.data.length === 0) {
          console.info("🛈 No se encontró el documento en <<Shippings>>");
          resolve([]); // Devolver un array vacío en lugar de null
        } else if (data.success) {
          const shippingData = data.data[0].dataRes;
          console.log("Documento: <<Shipping>>", shippingData);
          resolve([JSON.parse(JSON.stringify(shippingData))]); // Devolver un array con el objeto en lugar de solo el objeto
        }
      })
      .catch((error) => {
        console.error("Error en <<getOneShippingById - Services>>", error);
        reject(error);
      });
  });
}
