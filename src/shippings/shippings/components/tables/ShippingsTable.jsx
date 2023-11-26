//FIC: Material UI
import { MaterialReactTable } from 'material-react-table';
import { useState, useEffect } from 'react';
import { Box, Stack, Tooltip, Button, IconButton, Dialog } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";

//FIC: DB
// import ShippingsData from '../../../../../db/ecommerce/json/shippings/ShippingsData';
import { getAllShippings } from '../../services/remote/get/GetAllShippings';
import AddShippingsModal from '../AddShipingsModal';

//FIC: Columns Table Definition.
const ShippingsColumns = [
    {
      accessorKey: "id_ordenOK", //***IMPORTANTE: El nombre tiene que ser igual al de MongoDB o no se muestra en la tabla***
      header: "ID OK",
      size: 30, //small column
    },
    {
      accessorKey: "id_domicilioOK",
      header: "ID Domicilio",
      size: 30, //small column
    },
    {
      accessorKey: "id_proveedorOK",
      header: "ID Proveedor",
      size: 150, //small column
    }
  ];
//FIC: Table - FrontEnd.
  const ShippingsTable = () => {
    //FIC: controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(true);
    //FIC: controlar el estado de la data de shippings.
    const [shippingsData, setShippingsData] = useState([]);
    //FIC: controlar el estado que muesta u oculta la modal de nuevo Instituto.
    const [AddShippingShowModal, setAddShippingShowModal] = useState(false);

    useEffect(() => {
      async function fetchData() {
        try {
          const AllShippingsData = await getAllShippings();
          setShippingsData(AllShippingsData);
          //setInstitutesData(InstitutesStaticData);
          setLoadingTable(false);
        } catch (error) {
          console.error("Error al obtener los envios en useEffect de ShippingsTable:", error);
        }
      }
      fetchData();
    }, []);

    //PARA LA FUNCIÓN onUpdateShippingsData en AddShippingsModal.jsx
    const handleUpdateShippingData = async () => {
      try {
          const updatedShippingsData = await getAllShippings();
          setShippingsData(updatedShippingsData);
      } catch (error) {
          console.error("Error updating shipping data:", error);
      }
    };

    return (
        <Box>
          <Box>
            <MaterialReactTable
            columns={ShippingsColumns}
            data={shippingsData}
            initialState={{ density: "compact", showGlobalFilter: true }}
            state={{isLoading: loadingTable}}
            renderTopToolbarCustomActions={({ table }) => (
                <>
                  {/* ------- BARRA DE ACCIONES ------ */}
                  <Stack direction="row" sx={{ m: 1 }}>
                    <Box>
                      <Tooltip title="Agregar">
                        <IconButton 
                        onClick={() => setAddShippingShowModal(true)}>
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
                  {/* ------- BARRA DE ACCIONES FIN ------ */}
                </>
              )}
            />
          </Box>

          {/* M O D A L E S */}   
          <Dialog open={AddShippingShowModal}>
            <AddShippingsModal
              AddShippingShowModal={AddShippingShowModal}
              setAddShippingShowModal={setAddShippingShowModal}
              onUpdateShippingData={handleUpdateShippingData} //PARTE DE LA FUNCION handleUpdateShippingData
              onClose={() => setAddShippingShowModal(false)}
            />
          </Dialog>

        </Box>
      );
  };

export default ShippingsTable;
