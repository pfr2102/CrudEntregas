import axios from "axios";

export function GetAllSubdoc(IdInstitutoOK, IdNegocioOK, IdEntregaOK, subdocument) {
    return new Promise((resolve, reject) => {
      const queryParams = `?IdInstitutoOK=${IdInstitutoOK}&IdNegocioOK=${IdNegocioOK}&IdEntregaOK=${IdEntregaOK}&subdocument=${subdocument}`;
      axios.get(`http://localhost:3020/api/pwa/shipping/subdocument${queryParams}`)
        .then((response) => {
          const data = response.data;
          if (!data.success) {
            console.error("<<ERROR>> <<NO>> se ejecuto la API <<GetAllSubdoc>> de forma correcta", data);
            reject(data); //FIC: Rechaza la promesa con la respuesta si no fue exitosa
          } else if (data.data.length === 0) {
            console.info("🛈 <<NO>> se encontraron subdocumentos <<ordenes>>");
            resolve([]);
          } else if (data.success) {
            const orders = data.data[0].dataRes;
            console.log("Coleccion: <<ordenes>>", orders);
            resolve(JSON.parse(JSON.stringify(orders))); // Resuelve la promesa y hace una copia profunda
          }
        })
        .catch((error) => {
          console.error("<<ERROR>> en API <<GetAllOrders>>", error);
          reject(error); // Rechaza la promesa en caso de error
        });
    });
  }