import { Box, Container } from "@mui/material";
import InfoAdTable from "../tables/InfoAdTable";

export default function InfoAdicionalTab() {
    return (
    <Container maxWidth="lg">
      <Box>
        <br></br>
        <br></br>
            <InfoAdTable />
            <h2>Tab con la tabla del subdocumento de info adicional</h2>
 
      </Box>
    </Container>
    );
 
}
