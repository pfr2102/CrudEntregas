import axios from "axios";
export function GetAllInstitutes() {
    return new Promise((resolve, reject) => {
      axios.get(import.meta.env.VITE_CAT_INSTITUTES_URL)
        .then((response) => {
          const data = response.data;
          if (!data.success) {
            console.error("<<ERROR>> <<NO>> se ejecuto la API <<GetAllInstitutes>> de forma correcta", data);
            reject(data); //FIC: Rechaza la promesa con la respuesta si no fue exitosa
          } else if (data.data.length === 0) {
            console.info("🛈 <<NO>> se encontraron documentos <<cat_institutos>>");
            resolve([]);
          } else if (data.success) {
            const labels = data.data[0].dataRes;
            console.log("Coleccion: <<cat_institutos>>", labels);
            resolve(JSON.parse(JSON.stringify(labels))); // Resuelve la promesa y hace una copia profunda
          }
        })
        .catch((error) => {
          console.error("<<ERROR>> en API <<GetAllInstitutes>>", error);
          reject(error); // Rechaza la promesa en caso de error
        });
    });
  }
