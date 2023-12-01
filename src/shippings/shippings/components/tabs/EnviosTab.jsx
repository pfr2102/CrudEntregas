import { Box } from "@mui/material";
import { useState } from "react";
//FIC:
import EnviosNavTab from "./EnviosNavTab";
import EnviosSubTab from "./EnviosSubTab";
import InfoAdTab from "./InfoAdTab";
import ProductosTab from "./ProductosTab";
import EstatusTab from "./EstatusTab";
import RastreosTab from "./RastreosTab";

export default function EnviosTab() {
 
  //FIC: indicamos que al iniciar no hay ningun Instituto seleccionado.
  const [currentRowInUserTab, setCurrentRowInUserTab] = useState(1);   
 
  //FIC: indicamos que el estado inicial del tab page principal por default sera INSTITUTOS.
  const [currentNameTabInUserTab, setCurrentNameTabInUserTab] = useState("ENVIOS");
 
  return (
      <Box> 
            <EnviosNavTab
                currentRowInUserTab={currentRowInUserTab} 
                setCurrentNameTabInUserTab={setCurrentNameTabInUserTab} 
            />

            {/* <h2>Tab con la tabla del subdocumento de Negocios de la coleccion de Institutos</h2>
            <h2>Este debera abrir otro NAVTAB DE NEGOCIOS porque tiene subdocumentos no es un objeto final</h2> */}
           
            {console.log(currentNameTabInUserTab)}
            {/* {currentNameTabInBusinessTab == "NEGOCIOS" && <BusinessTab />} */}
           
            {currentNameTabInUserTab == "ENVIOS" && <EnviosSubTab />}
            {currentNameTabInUserTab == "INFO AD" && <InfoAdTab />}
            {currentNameTabInUserTab == "PRODUCTOS" && <ProductosTab />}
            {currentNameTabInUserTab == "ESTATUS" && <EstatusTab />}
            {currentNameTabInUserTab == "RASTREOS" && <RastreosTab />}

      </Box>
    );
  }
  