//FIC: React
import React, { useEffect, useState } from "react";
//FIC: Material UI
import { MaterialReactTable } from 'material-react-table';
import { Box, Stack, Tooltip, Button, IconButton, Dialog } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
//FIC: DB

//FEAK: MODALS
import InfoAdModal from "../InfoAdModal";

//REDUX
import { useSelector } from "react-redux";
import { SET_SELECTED_SHIPPING_DATA } from "../../../redux/slices/shippingsSlice";

//FIC: Columns Table Definition.
const InfoAdColumns = [
    {
      accessorKey: "IdEtiquetaOK",
      header: "Id Etiqueta OK",
      size: 30, //small column
    },
    {
      accessorKey: "IdEtiqueta",
      header: "Id Etiqueta",
      size: 30, //small column
    },
    {
      accessorKey: "Etiqueta",
      header: "Etiqueta",
      size: 150, //small column
    },
    {
      accessorKey: "Valor",
      header: "Valor",
      size: 50, //small column
    },
    {
      accessorKey: "IdTipoSeccionOK",
      header: "Tipo seccion",
      size: 30, //small column
    },
    {
      accessorKey: "Secuencia",
      header: "Secuencia",
      size: 150, //small column
    },
  ];

  //FIC: Table - FrontEnd.
  const InfoAdTable = ({ }) => {

    //FIC: controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(true);
    //FIC: controlar el estado de la data de InfoAd.
    const [InfoAdData, setInfoAdData] = useState([]);
    //FIC: controlar el estado que muesta u oculta la modal de nuevo InfoAd.
    const [InfoAdShowModal, setInfoAdShowModal] = useState(false);

    //Con redux sacar la data que se envió del otro archivo (ShippingsTable)
    const selectedShippingData = useSelector((state) => state.shippingsReducer.selectedShippingData);
    // console.log(selectedShippingData);

    useEffect(() => {
      async function fetchData() {
        try {
          setInfoAdData(selectedShippingData.info_ad); //Se ponen los datos en el useState pero solo los del subdocumento info_ad
          setLoadingTable(false);
        } catch (error) {
          console.error("Error al obtener info_ad:", error);
        }
      }
      fetchData();
    }, []);

    return (
        <Box>
          <Box>
            <MaterialReactTable
              columns={InfoAdColumns}
              data={InfoAdData}
              state={{isLoading: loadingTable}}
              initialState={{ density: "compact", showGlobalFilter: true }}
              renderTopToolbarCustomActions={({ table }) => (
                  <>
                    {/* ------- ACTIONS TOOLBAR INIT ------ */}
                    <Stack direction="row" sx={{ m: 1 }}>
                      <Box>
                        <Tooltip title="Agregar">
                          <IconButton 
                          onClick={() => setInfoAdShowModal(true)}>
                            <AddCircleIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Detalles ">
                          <IconButton>
                            <InfoIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Stack>
                    {/* ------- ACTIONS TOOLBAR END ------ */}
                  </>
                )}
            />
          </Box>

          {/* M O D A L E S */}   
          <Dialog open={InfoAdShowModal}>
            <InfoAdModal
              InfoAdShowModal={InfoAdShowModal}
              setInfoAdShowModal={setInfoAdShowModal}
              selectedShippingData={selectedShippingData} //Pasar como prop los datos que sacamos de redux desde ShippingsTable para 
              onClose={() => setInfoAdShowModal(false)}   //usarlos en InfoAdModal y consecuentemente en formik.
            />
          </Dialog>

        </Box>
      );
  };

  export default InfoAdTable;