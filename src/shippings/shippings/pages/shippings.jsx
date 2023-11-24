import { Box } from "@mui/material";
import { useState } from "react";
import ShippingsNavTab from "../components/tabs/ShippingsNavTab";
import InstitutesTab from "../components/tabs/ShippingsTab";
import BusinessTab from "../components/tabs/UserTab";

const Shippings = () => {

    //FIC: indicamos que al iniciar no hay ningun Instituto seleccionado.
    const [currentRowInShippingsTab, setCurrentRowInShippingsTab] = useState(0);
   
    //FIC: indicamos que el estado inicial del tab page principal por default sera INSTITUTOS.
    const [currentTabInPrincipalTab, setCurrentTabInPrincipalTab] = useState("SHIPPINGS");
   
    const [userTabInPrincipalTabIsSelected, setUserTabInPrincipalTabIsSelected] = useState(false);
    //const InstitutosAllData = useSelector((state) => state.institutesReducer);
    return (
        <Box>

            {/* FIC: llamada intrinsica (props) */}

            <ShippingsNavTab
                setCurrentRowInShippingsTab={setCurrentRowInShippingsTab}
                setCurrentTabInPrincipalTab={setCurrentTabInPrincipalTab}
                setUserTabInPrincipalTabIsSelected={setUserTabInPrincipalTabIsSelected}
            />
           
            {/* FIC: si en el tap principal esta seleccionado es el tab de INSTITUTOS
            manda llamar la pagina que va dentro del tab de Institutos. */}
            {currentTabInPrincipalTab == "SHIPPINGS" && <InstitutesTab />}

            {/* FIC: si en el tap principal esta seleccionado el tab de NEGOCIOS
            manda llamar la pagina que va dentro del tab de Business. */}
            {currentTabInPrincipalTab == "USUARIO" && <BusinessTab />}   

        </Box>
    );
};

export default Shippings;
