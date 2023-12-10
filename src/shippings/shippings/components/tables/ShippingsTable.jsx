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

    //useEffect con querySelector que se le coloca a cada fila junto con un EventListener para manejar 
    //los clics en la tabla y nos devuelva los datos del documento correspondiente
    //usar el useEffect para ejecutar cada que se haga un cambio en shippingsData
    useEffect(() => {
      const handleRowClick = (index) => {
        const row = shippingsData[index];
        //Aqui es donde se decide que hacer con la data que regresa el clic en la fila
        console.log("<<ID DEL DOCUMENTO SELECCIONADO>>:", row.IdEntregaOK); //row.IdEntregaOK devuelve solo el id, debe funcionar con todo lo demas
        //Poner el modo de editar y pasar la data                           por lo que se puede usar formik??? para colocar la data en los textfield
        setIsEditMode(true);
        setEditData(row);
        setSelectedRowIndex(index);
        console.log("INDICE SELECCIONADO",index);
        //Dispatch para enviar data a redux y que este la pase a InfoAdTable
        dispatch(SET_SELECTED_SHIPPING_DATA(row)); 
        //SE PASA COMPLETO PORQUE SE NECESITA EL ID DEL DOCUMENTO PRINCIPAL PARA INSERTAR EL SUBDOCUMENTO
        //SI QUISIERAS PASAR SOLO UN CAMPO O SUBDOCUMENTO SERIA CON row.info_ad o con row.IdEntregaOK
      };
      const rows = document.querySelectorAll('.MuiTableRow-root'); //Se seleccionan todas las filas de la tabla con la clase .MuiTableRow-root
      //se añade un EventListener a cada fila y cuando se hace clic se ejecuta la función handleRowClick con el dato correspondiente de shippingsData
      rows.forEach((row, index) => { 
        row.addEventListener('click', () => handleRowClick(index-1)); //Aqui es index-1 porque index me traía la fila siguiente a la que presionabas
      });
      //Cuando shippingsData cambia se "limpian" los EventListeners para evitar posibles problemas de memoria o fuga de eventos
      return () => {
        rows.forEach((row, index) => {
          row.removeEventListener('click', () => handleRowClick(index-1));
        });
      };
    }, [shippingsData]);

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
                setSelectedRowIndex(row.original);
                setSelectedRowIndex(row.id);
              },
              sx: {
                cursor: loadingTable ? "not-allowed" : "pointer",
                backgroundColor:
                selectedRowIndex === row.id ? darken("#EFF999", 0.01) : "inherit",
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
