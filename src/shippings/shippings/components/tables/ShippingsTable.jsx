//FIC: Material UI
import { MaterialReactTable } from 'material-react-table';
import { useState, useEffect } from 'react';
import { Box, Stack, Tooltip, Button, IconButton, Dialog, darken } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";

//FIC: DB
// import ShippingsData from '../../../../../db/ecommerce/json/shippings/ShippingsData';
import { getAllShippings } from '../../services/remote/get/GetAllShippings';
import AddShippingsModal from '../AddShipingsModal';

//REDUX
import { useDispatch } from 'react-redux';
import { SET_SELECTED_SHIPPING_DATA } from '../../../redux/slices/shippingsSlice';

//FIC: Columns Table Definition.
const ShippingsColumns = [
    {
      accessorKey: "IdInstitutoOK", 
      header: "ID Instituto",
      size: 30, //small column
    },
    {
      accessorKey: "IdNegocioOK", 
      header: "ID Negocio",
      size: 30, //small column
    },
    {
      accessorKey: "IdEntregaOK", //***IMPORTANTE: El nombre tiene que ser igual al de MongoDB o no se muestra en la tabla***
      header: "ID EntregaOK",
      size: 30, //small column
    },
    {
      accessorKey: "IdEntregaBK",
      header: "ID EntregaBK",
      size: 30, //small column
    },
    {
      accessorKey: "IdOrdenOK",
      header: "ID Orden",
      size: 150, //small column
    }
  ];
//FIC: Table - FrontEnd.
  const ShippingsTable = () => {
    //FIC: controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(true);
    //FIC: controlar el estado de la data de shippings.
    const [shippingsData, setShippingsData] = useState([]);
    //FIC: controlar el estado que muesta u oculta la modal de nuevo Shippings.
    const [AddShippingShowModal, setAddShippingShowModal] = useState(false);

    //PARA CONTROLAR LO DE GUARDAR O ACTUALIZAR
    const [isEditMode, setIsEditMode] = useState(false); //Para determinar si la modal está en modo de edicion/agregar (true=editar || false=agregar)
    const [editData, setEditData] = useState(false);     //Para saber si hay que rellenar los textfield con datos en caso de estar en modo de edición
    const [isDeleteMode, setIsDeleteMode] = useState(false); //Para saber si está en modo de eliminación o no
    const [selectedRowIndex, setSelectedRowIndex] = useState(null); //Para saber cual es la fila y pasarla para el color de la tabla

    const dispatch = useDispatch();

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
    //Esta es la función para hacer un "refresh" a la tabla
    const handleUpdateShippingData = async () => {
      try {
          const updatedShippingsData = await getAllShippings();
          setShippingsData(updatedShippingsData);
          console.log("DATA EN EL editData", editData); //Para saber que datos tiene almacenados editData
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
            muiTableBodyRowProps={({ row }) => ({
              onClick: () => {
                setSelectedRowIndex(row.original); //row.original hace referencia al objeto de datos original asociado con la fila
                console.log("DATOS AAA", row.original);
                setEditData(row.original); //Poner la data en el useState 
                dispatch(SET_SELECTED_SHIPPING_DATA(row.original)); //Pasar los datos a redux y despues al otroa archivo
                setSelectedRowIndex(row.id); //row.id se asigna automaticamente por react-table a cada fila
              },
              sx: {
                cursor: loadingTable ? "not-allowed" : "pointer",
                backgroundColor:
                selectedRowIndex === row.id ? darken("#EFF999", 0.01) : "inherit", //Para pintar de color la fila que coincida con row.id
              },
            })}
            renderTopToolbarCustomActions={({ table }) => (
                <>
                  {/* ------- BARRA DE ACCIONES ------ */}
                  <Stack direction="row" sx={{ m: 1 }}>
                    <Box>
                      <Tooltip title="Agregar">
                        <IconButton 
                        onClick={() => {
                          setAddShippingShowModal(true);
                          setIsEditMode(false); //Poner modo de edición en falso porque vamos a agregar no editar
                          setEditData(null); //Poner la edición de data en nulo porque no tiene que haber nada en los textfield
                          setIsDeleteMode(false);
                          }}>
                          <AddCircleIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton onClick={() => {
                          setAddShippingShowModal(true);
                          setIsDeleteMode(false);
                          setIsEditMode(true);
                          }}> {/*Para que se abra la modal de actualizar SOLO despues de dar clic al boton */}
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton onClick={() => {
                          setIsDeleteMode(true);
                          setIsEditMode(false);
                          setAddShippingShowModal(true);
                          }}>
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
              isDeleteMode={isDeleteMode} 
              row={isEditMode || isDeleteMode ? editData : null}  //Para que en ambos modales de eliminar y actualizar se ponga 
                                                                  //la info si es que hay datos
              onClose={() => {
                setAddShippingShowModal(false); //Cerrar la modal
                setIsEditMode(false); //Resetear el modo de edición
                setEditData(null); //Limpiar la data de edición
              }}
            />
          </Dialog>
        </Box>
      );
  };

export default ShippingsTable;
