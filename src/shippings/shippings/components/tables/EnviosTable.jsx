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
import { GetAllSubdoc } from "../../services/remote/get/GetAllInfoAd";

//FEAK: MODALS
import EnviosModal from "../EnviosModal";

//REDUX
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import { SET_SELECTED_ENVIO_DATA } from "../../../redux/slices/shippingsSlice";

//FIC: Columns Table Definition.
const EnviosColumns = [
    {
      accessorKey: "IdDomicilioOK",
      header: "Id Domicilio OK",
      size: 30, //small column
    },
    {
      accessorKey: "IdPaqueteriaOK",
      header: "Id Paqueteria OK",
      size: 30, //small column
    },
    {
      accessorKey: "IdTipoMetodoEnvio",
      header: "Id Tipo Metodo Envio",
      size: 150, //small column
    },
    {
      accessorKey: "CostoEnvio",
      header: "Costo Envio",
      size: 50, //small column
    },
  ];

  //FIC: Table - FrontEnd.
  const EnviosTable = ({}) => {

    //FIC: controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(true);
    //FIC: controlar el estado de la data de Envios.
    const [EnviosData, setEnviosData] = useState([]);
    //FIC: controlar el estado que muesta u oculta la modal de nuevo Envios.
    const [EnviosShowModal, setEnvioShowModal] = useState(false);
    const [triggerReloadTable, setTriggerReloadTable] = useState(false); //Para hacer la recarga de la tabla
    
    const [isEditMode, setIsEditMode] = useState(false); //Para determinar si la modal está en modo de edicion/agregar (true=editar || false=agregar)
    const [editData, setEditData] = useState(false);//Para saber si hay que rellenar los textfield con datos en caso de estar en modo de edición
    const [isDeleteMode, setIsDeleteMode] = useState(false); //Para saber si está en modo de eliminación o no

    const dispatch = useDispatch();

    //Con redux sacar la data que se envió del otro archivo (ShippingsTable)
    const selectedShippingData = useSelector((state) => state.shippingsReducer.selectedShippingData);
    // console.log(selectedShippingData);

    //ESTOS DATOS, SOBRETODO IdEntregaOK son los que definen que docuemento sacar y la const de subdoc define que subdocumento sacar
    //del documento seleccionado
    const instituto = selectedShippingData.IdInstitutoOK;
    const negocio = selectedShippingData.IdNegocioOK;
    const entrega = selectedShippingData.IdEntregaOK;
    const subdoc = 'envios'
    // console.log("DATOS PASADOSAAAA", instituto, negocio, entrega);
    // const InfoAdDATA = GetAllSubdoc(instituto, negocio, entrega, subdoc);

    useEffect(() => {
      async function fetchData() {
        try {
          const AllEnviosData = await GetAllSubdoc(instituto, negocio, entrega, subdoc);
          console.log("DATOS DEL GET SUBDOC", AllEnviosData);
          setEnviosData(AllEnviosData);
          setLoadingTable(false);
        } catch (error) {
          console.error("Error al obtener los envios en useEffect de EnviosTable:", error);
        }
      }
      fetchData();
    }, [triggerReloadTable]);

    //RECARGA DE TABLA
    const reloadTableData = () => {
      setTriggerReloadTable(!triggerReloadTable);
    };

    //useEffect para al hacer clic en la tabla nos traiga los datos del docuemnto de esa fila
    useEffect(() => {
      const handleRowClick = (index) => {
        const row = EnviosData[index];
        //Aqui es donde se decide que hacer con la data que regresa el clic en la fila
        console.log("<<ID DEL DOCUMENTO SELECCIONADO>>:", row.IdDomicilioOK); //row.id_domicilioOK devuelve solo el id, debe funcionar con todo lo demas
        //Poner el modo de editar y pasar la data               por lo que se puede usar formik??? para colocar la data en los textfield
        setIsEditMode(true);
        setEditData(row);
        console.log("INDICE SELECCIONADO",index);
        //Dispatch para enviar data a redux y que este la pase a EnvInfoAdTable para saber el IdDomicilio
        dispatch(SET_SELECTED_ENVIO_DATA(row)); //Para pasar la data del envio presionado a los subdocs
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
    }, [EnviosData]);

    return (
        <Box>
          <Box>
            <MaterialReactTable
              columns={EnviosColumns}
              data={EnviosData}
              state={{isLoading: loadingTable}}
              initialState={{ density: "compact", showGlobalFilter: true }}
              renderTopToolbarCustomActions={({ table }) => (
                  <>
                    {/* ------- ACTIONS TOOLBAR INIT ------ */}
                    <Stack direction="row" sx={{ m: 1 }}>
                      <Box>
                        <Tooltip title="Agregar">
                          <IconButton 
                          onClick={() => {
                            setEnvioShowModal(true);
                            setIsEditMode(false);
                            setEditData(null);
                            setIsDeleteMode(false);
                            }}>
                            <AddCircleIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                          onClick={() => {
                            setEnvioShowModal(true);
                            setIsEditMode(true);
                            setIsDeleteMode(false);
                          }}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                          onClick={() => {
                            setEnvioShowModal(true);
                            setIsEditMode(false);
                            setIsDeleteMode(true);
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
                    {/* ------- ACTIONS TOOLBAR END ------ */}
                  </>
                )}
            />
          </Box>

          {/* M O D A L E S */}   
          <Dialog open={EnviosShowModal}>
            <EnviosModal
              EnviosShowModal={EnviosShowModal}
              setEnviosShowModal={setEnvioShowModal}
              isEditMode={isEditMode}
              row={isEditMode || isDeleteMode ? editData : null}
              isDeleteMode={isDeleteMode}
              reloadTable={reloadTableData} //Pasar como prop la recarga de la tabla
              selectedShippingData={selectedShippingData} //Pasar como prop los datos que sacamos de redux desde ShippingsTable para 
              onClose={() => {                            //usarlos en EnviosModal y consecuentemente en formik.
                setEnvioShowModal(false);
                setIsEditMode(false); //Resetear el modo de edición
                setEditData(null); //Limpiar la data de edición
                setIsDeleteMode(false);
              }}   
            />
          </Dialog>

        </Box>
      );
  };

  export default EnviosTable;