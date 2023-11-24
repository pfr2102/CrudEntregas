import { Box } from "@mui/material";
import { useState } from "react";
//FIC:
import UserNavTab from "./UserNavTab";
import InfoAdTab from "./InfoAdTab";
import FilesTab from "./FilesTab";
import PhonsTab from "./PhonesTab";
import AddressesTab from "./AdressesTab";
import WebAddressesTab from "./WebAdressesTab";

export default function BusinessTab() {
 
  //FIC: indicamos que al iniciar no hay ningun Instituto seleccionado.
  const [currentRowInUserTab, setCurrentRowInUserTab] = useState(1);   
 
  //FIC: indicamos que el estado inicial del tab page principal por default sera INSTITUTOS.
  const [currentNameTabInUserTab, setCurrentNameTabInUserTab] = useState("USUARIO");
 
  return (
      <Box> 
            <UserNavTab
                currentRowInUserTab={currentRowInUserTab} 
                setCurrentNameTabInUserTab={setCurrentNameTabInUserTab} 
            />

            {/* <h2>Tab con la tabla del subdocumento de Negocios de la coleccion de Institutos</h2>
            <h2>Este debera abrir otro NAVTAB DE NEGOCIOS porque tiene subdocumentos no es un objeto final</h2> */}
           
            {console.log(currentNameTabInUserTab)}
            {/* {currentNameTabInBusinessTab == "NEGOCIOS" && <BusinessTab />} */}
           
            {currentNameTabInUserTab == "ID" && <InfoAdTab />}
            {currentNameTabInUserTab == "NOMBRE" && <FilesTab />}
            {currentNameTabInUserTab == "CORREO" && <PhonsTab />}
            {currentNameTabInUserTab == "TELEFONO" && <WebAddressesTab />}

      </Box>
    );
  }
  