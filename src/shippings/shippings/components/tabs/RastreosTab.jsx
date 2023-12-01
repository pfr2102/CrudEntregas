import { Box } from "@mui/material";
import RastreosNavTab from "./RastreosNavTab";
import RastreoSubTab from "./RastreoSubTab";
import SeguimientoTab from "./Seguimiento";
import { useState } from "react";

export default function RastreoTab() {
  
  //FIC: indicamos que al iniciar no hay ningun Instituto seleccionado.
  const [currentRowInUserTab, setCurrentRowInUserTab] = useState(1);   
 
  //FIC: indicamos que el estado inicial del tab page principal por default sera INSTITUTOS.
  const [currentNameTabInUserTab, setCurrentNameTabInUserTab] = useState("RASTREOS");
  
  return (
 
      <Box>
            <RastreosNavTab
              currentRowInUserTab={currentRowInUserTab} 
              setCurrentNameTabInUserTab={setCurrentNameTabInUserTab} 
            />

            {/* <h2>Tab con la tabla del subdocumento de Negocios de la coleccion de Institutos</h2>
            <h2>Este debera abrir otro NAVTAB DE NEGOCIOS porque tiene subdocumentos no es un objeto final</h2> */}
           
           {console.log(currentNameTabInUserTab)}
            {/* {currentNameTabInBusinessTab == "NEGOCIOS" && <BusinessTab />} */}
           
            {currentNameTabInUserTab == "RASTREOS" && <RastreoSubTab />}
            {currentNameTabInUserTab == "SEGUIMIENTO" && <SeguimientoTab />}
 
      </Box>
 
    );
 
}
