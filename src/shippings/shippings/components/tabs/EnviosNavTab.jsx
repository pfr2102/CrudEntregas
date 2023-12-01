import { Box, Tab, Tabs, Stack } from "@mui/material";
import React, { useState } from "react";

const UserTabs = ["Envios", "Info Ad", "Productos", "Estatus", "Rastreos"];

const EnviosNavTab = ({ currentRowInUserTab, setCurrentNameTabInUserTab }) => {
const [currenTabIndex, setCurrentTabIndex] = useState(0);

//FIC: Evento Change
const handleChange = (e) => {
setCurrentNameTabInUserTab(e.target.innerText.toUpperCase());
        switch (e.target.innerText.toUpperCase()) {
                case "ENVIOS":
                        setCurrentTabIndex(0);
                        break;
                case "INFO AD":
                        setCurrentTabIndex(1);
                        break;
                case "PRODUCTOS":
                        setCurrentTabIndex(2);
                        break;
                case "ESTATUS":
                        setCurrentTabIndex(3);
                        break;
                case "RASTREOS":
                        setCurrentTabIndex(4);
                        break;
        }
};
return (
<Box sx={{ border: (theme) => `1px solid ${theme.palette.divider}`, mx: 1, padding: 0.5 }}>
<Tabs
value={currenTabIndex}
variant={"fullWidth"}
onChange={handleChange}
aria-label="icon tabs example"
textColor="primary"
>
{UserTabs.map((tab) => {
return <Tab key={tab} label={tab} disabled ={currentRowInUserTab === null}/>;
})}
</Tabs>
</Box>
);
};

export default EnviosNavTab;
