import { Box, Tab, Tabs, Stack } from "@mui/material";
import React, { useState } from "react";

const UserTabs = ["ID", "Nombre", "Correo", "Telefono"];

const UserNavTab = ({ currentRowInUserTab, setCurrentNameTabInUserTab }) => {
const [currenTabIndex, setCurrentTabIndex] = useState(0);

//FIC: Evento Change
const handleChange = (e) => {
setCurrentNameTabInUserTab(e.target.innerText.toUpperCase());
        switch (e.target.innerText.toUpperCase()) {
                case "ID":
                        setCurrentTabIndex(0);
                        break;
                case "NOMBRE":
                        setCurrentTabIndex(1);
                        break;
                case "CORREO":
                        setCurrentTabIndex(2);
                        break;
                case "TELEFONO":
                        setCurrentTabIndex(3);
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

export default UserNavTab;
