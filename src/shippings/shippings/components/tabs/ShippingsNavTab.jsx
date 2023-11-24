import { Box, Tabs, Tab } from "@mui/material";
import React, { useEffect, useState } from "react";
//import { Link, useHistory } from "react-router-dom";
const ShippingsTabs = ["Shippings", "Usuario"];

const ShippingsNavTab = ({currentRowInShippingsTab, setCurrentTabInPrincipalTab, setUserTabInPrincipalTabIsSelected}) => {
    const [currenTabIndex, setCurrentTabIndex] = useState(0);
    
    const handleChange = (e) => {
        console.log("entro al handleChange", e.target.innerText.toUpperCase());
        //FIC: actualizar el nombre de la pestaña seleccionada.
        setCurrentTabInPrincipalTab(e.target.innerText.toUpperCase());
        //FIC: cada que realice un click en algun tap page
        //reiniciamos el valor del tap pase de user a false.
        setUserTabInPrincipalTabIsSelected(false);
        //FIC: opciones (subdocumentos de la coleccion principal de shippings).
        switch (e.target.innerText.toUpperCase()) {
            case "SHIPPINGS":
                setCurrentTabIndex(0);
                break;
            case "USUARIO":
                setCurrentTabIndex(1);
                break;
        }
        //FIC: cambiamos el estado de la tap de user a un true para indicar
        //que el usuario ya hizo click en esta pestaña y entonces se despliegue el
        //UserNavTap con los tab pages de este nivel (subdocumento) que contiene
        //mas subdocumentos como: etc.
        if (e.target.innerText.toUpperCase() == "USUARIO") setUserTabInPrincipalTabIsSelected(true);
    };

    return (
        <Box sx={{ border: (theme) => `2px solid ${theme.palette.divider}`, mx: 1, padding: 0.5 }}>
            <Tabs
                value={currenTabIndex}
                variant={"fullWidth"}
                onChange={handleChange}
                aria-label="icon tabs example"
                textColor="primary"
            >
                {ShippingsTabs.map((tab) => {
                    return <Tab key={tab} label={tab} />;
                })}
            </Tabs>
        </Box>
    );
}
export default ShippingsNavTab;
