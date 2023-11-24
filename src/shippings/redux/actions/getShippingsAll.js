import axios from 'axios';
export async function getShippingsAll() {
    let result = await axios.get(`http://localhost:3020/api/pwa/shipping`); ///En esta parte donde termina la comilla iba /institutos en
                                                                                         //el original, pero se quito porque no era la ruta correcta 
    console.log('<<AXIOS-SHIPPINGS>>: ', result.data);
    return result.data;
}
//La solucion "podría" estar aqui, este archivo podria ser como la nota 4.9 donde se usa para los request de axios
// Checar tambien en la pestaña de la extensión de redux la parte de payload, quiza algo se pueda hacer ahí