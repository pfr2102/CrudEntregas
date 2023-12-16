import axios from "axios";
export function GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK) {
    return new Promise((resolve, reject) => {
      //FIC: URL = http://localhost:8080/api/pwa/labels 
      //axios.get("http://localhost:8080/api/pwa/labels") 
      axios.get(`${import.meta.env.VITE_ORDERS_URL}/one?IdInstitutoOK=${IdInstitutoOK}&IdNegocioOK=${IdNegocioOK}&IdOrdenOK=${IdOrdenOK}`)
        .then((response) => {
          const data = response.data;
          if (!data.success) {
            console.error("<<ERROR>> <<NO>> se ejecuto la API <<GetAllOrders>> de forma correcta", data);
            reject(data); //FIC: Rechaza la promesa con la respuesta si no fue exitosa
          } else if (data.data.length === 0) {
            console.info("🛈 <<NO>> se encontraron documentos <<ordenes>>");
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