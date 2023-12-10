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
// import { GetAllSubdoc } from "../../services/remote/get/GetAllInfoAd";
import { GetEnviosId } from "../../services/remote/get/GetEnviosId";

//FEAK: MODALS
import SeguimientoModal from "../SeguimientoModal";

//REDUX
import { useSelector } from "react-redux";
import { SET_SELECTED_SHIPPING_DATA } from "../../../redux/slices/shippingsSlice";

//FIC: Columns Table Definition.
const SeguimientoColumns = [
    {
      accessorKey: "Ubicacion",
      header: "Ubicacion",
      size: 30, //small column
    },
    {
      accessorKey: "DesUbicacion",
      header: "DesUbicacion",
      size: 30, //small column
    },
    {
      accessorKey: "Referencias",
      header: "Referencias",
      size: 150, //small column
    },
    {
      accessorKey: "Observacion",
      header: "Observacion",
      size: 50, //small column
    },
    {
      accessorKey: "FechaReg",
      header: "FechaReg",
      size: 30, //small column
    },
    {
      accessorKey: "UsuarioReg",
      header: "UsuarioReg",
      size: 150, //small column
    },
  ];

  //FIC: Table - FrontEnd.
  const SeguimientoTable = ({}) => {

    //FIC: controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(true);
    //FIC: controlar el estado de la data de InfoAd.
    const [SeguimientoData, setSeguimientoData] = useState([]);
    //FIC: controlar el estado que muesta u oculta la modal de nuevo InfoAd.
    const [SeguimientoShowModal, setSeguimientoShowModal] = useState(false);
    
    const [isEditMode, setIsEditMode] = useState(false); //Para determinar si la modal está en modo de edicion/agregar (true=editar || false=agregar)
    const [editData, setEditData] = useState(false);//Para saber si hay que rellenar los textfield con datos en caso de estar en modo de edición
    const [isDeleteMode, setIsDeleteMode] = useState(false); //Para saber si está en modo de eliminación o no
    const [triggerReloadTable, setTriggerReloadTable] = useState(false); //Para hacer la recarga de la tabla

    //Con redux sacar la data que se envió del otro archivo (EnviosTable.jsx)
    const selectedShippingData = useSelector((state) => state.shippingsReducer.selectedShippingData);
    const selectedEnvioData = useSelector((state) => state.shippingsReducer.selectedEnvioData);
    // console.log(selectedShippingData);

    //Solicitud GET con los datos que hicimos clic en la tabla principal (selectedShippingData) y tabla de envios (selectedEnvioData)
    const instituto = selectedShippingData.IdInstitutoOK;
    const negocio = selectedShippingData.IdNegocioOK;
    const entrega = selectedShippingData.IdEntregaOK;
    const domicilio = selectedEnvioData.IdDomicilioOK;

    useEffect(() => {
      async function fetchData() {
        try {
          const AllSeguimientoData = await GetEnviosId(instituto, negocio, entrega, domicilio);
          console.log("DATOS DEL GET SUBDOC OUYEA", AllSeguimientoData.rastreos.seguimiento);
          setSeguimientoData(AllSeguimientoData.rastreos.seguimiento);
          setLoadingTable(false);
        } catch (error) {
          console.error("Error al obtener los productos en useEffect de ProductosTable:", error);
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
        const row = SeguimientoData[index];
        //Aqui es donde se decide que hacer con la data que regresa el clic en la fila
        console.log("<<ID DEL DOCUMENTO SELECCIONADO>>:", row.Ubicacion); //row.id_domicilioOK devuelve solo el id, debe funcionar con todo lo demas
        //Poner el modo de editar y pasar la data               por lo que se puede usar formik??? para colocar la data en los textfield
        setIsEditMode(true);
        setEditData(row);
        console.log("INDICE SELECCIONADO",index);
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
    }, [SeguimientoData]);

    return (
        <Box>
          <Box>
            <MaterialReactTable
              columns={SeguimientoColumns}
              data={SeguimientoData}
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
                            setSeguimientoShowModal(true);
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
                            setSeguimientoShowModal(true);
                            setIsEditMode(true);
                            setIsDeleteMode(false);
                          }}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                          onClick={() => {
                            setSeguimientoShowModal(true);
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
          <Dialog open={SeguimientoShowModal}>
            <SeguimientoModal
              SeguimientoShowModal={SeguimientoShowModal}
              setSeguimientoShowModal={setSeguimientoShowModal}
              isEditMode={isEditMode}
              row={isEditMode || isDeleteMode ? editData : null}
              isDeleteMode={isDeleteMode}
              reloadTable={reloadTableData} //Pasar como prop la recarga de la tabla
              selectedShippingData={selectedShippingData}
              selectedEnvioData={selectedEnvioData} //Pasar como prop los datos que sacamos de redux desde ShippingsTable para 
              onClose={() => {                            //usarlos en InfoAdModal y consecuentemente en formik.
                setSeguimientoShowModal(false);
                setIsEditMode(false); //Resetear el modo de edición
                setEditData(null); //Limpiar la data de edición
                setIsDeleteMode(false);
              }}   
            />
          </Dialog>

        </Box>
      );
  };

export default SeguimientoTable;