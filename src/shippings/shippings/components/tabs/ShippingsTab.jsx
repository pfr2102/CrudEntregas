import { Box, Container } from "@mui/material";
import ShippingsTable from "../tables/ShippingsTable";

export default function InstitutesTab() {
    return (
    <Container maxWidth="lg">
      <Box>
        <br></br>
        <br></br>
            <ShippingsTable />
            {/* <h2>Tab con la tabla de la coleccion de Institutos</h2> */}
 
      </Box>
    </Container>
    );
 
}
