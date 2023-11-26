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

    //PARA CONTROLAR LO DE GUARDAR O ACTUALIZAR
    const [isEditMode, setIsEditMode] = useState(false);
    const [editData, setEditData] = useState(false);

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

    const handleRowClick = (row) => {
      //Aqui es donde se decide que hacer con la data que regresa el clic en la fila
      console.log("Clicked row data:", row);
      //Poner el modo de editar y pasar la data
      setAddShippingShowModal(true);
      setIsEditMode(true);
      setEditData(true);
    };

    //Al parecer MaterialReactTable no soporta directamente onRowClick por lo que se hace el useState con un querySelector
    //que se le coloca a cada fila junto con un EventListener
    useEffect(() => {
      const rows = document.querySelectorAll('.MuiTableRow-root');
  
      rows.forEach((row, index) => {
        row.addEventListener('click', () => handleRowClick(shippingsData[index-1])); //Aqui es index-1 porque index me traía la fila siguiente a la que presionabas
      });

      return () => {
        rows.forEach((row) => {
          row.removeEventListener('click', () => handleRowClick(shippingsData[index-1]));
        });
      };
    }, [shippingsData]);

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
              isEditMode={isEditMode}
              initialData={editData}
              onClose={() => {
                setAddShippingShowModal(false)
                setIsEditMode(false); //Resetear el modo de edición
                setEditData(null); //Limpiar la data de edición
              }}
            />
          </Dialog>

        </Box>
      );
  };

export default ShippingsTable;
