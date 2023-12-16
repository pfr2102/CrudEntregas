import axios from "axios";
export function GetAllPersonas() {
    return new Promise((resolve, reject) => {
      axios.get(import.meta.env.VITE_CAT_PERSONS_URL)
        .then((response) => {
          const data = response.data;
          if (!data.success) {
            console.error("<<ERROR>> <<NO>> se ejecuto la API <<GetAllPersonas>> de forma correcta", data);
            reject(data); //FIC: Rechaza la promesa con la respuesta si no fue exitosa
          } else if (data.data.length === 0) {
            console.info("🛈 <<NO>> se encontraron documentos <<cat_personas>>");
            resolve([]);
          } else if (data.success) {
            const personas = data.data[0].dataRes;
            console.log("Coleccion: <<cat_personas>>", personas);
            resolve(JSON.parse(JSON.stringify(personas))); // Resuelve la promesa y hace una copia profunda
          }
        })
        .catch((error) => {
          console.error("<<ERROR>> en API <<GetAllPersonas>>", error);
          reject(error); // Rechaza la promesa en caso de error
        });
    });
  }