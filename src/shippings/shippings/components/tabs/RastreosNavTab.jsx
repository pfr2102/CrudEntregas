import { Box, Tab, Tabs, Stack } from "@mui/material";
import React, { useState } from "react";

const RastreoTabs = ["Rastreos", "Seguimiento"];

const RastreosNavTab = ({ currentRowInUserTab, setCurrentNameTabInUserTab }) => {
const [currenTabIndex, setCurrentTabIndex] = useState(0);

//FIC: Evento Change
const handleChange = (e) => {
setCurrentNameTabInUserTab(e.target.innerText.toUpperCase());
        switch (e.target.innerText.toUpperCase()) {
                case "RASTREOS":
                        setCurrentTabIndex(0);
                        break;
                case "SEGUIMIENTO":
                        setCurrentTabIndex(1);
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
{RastreoTabs.map((tab) => {
return <Tab key={tab} label={tab} disabled ={currentRowInUserTab === null}/>;
})}
</Tabs>
</Box>
);
};

export default RastreosNavTab;
