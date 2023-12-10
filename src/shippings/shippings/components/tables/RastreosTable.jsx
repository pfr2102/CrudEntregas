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
import RastreosModal from "../RastreosModal";

//REDUX
import { useSelector } from "react-redux";
import { SET_SELECTED_SHIPPING_DATA } from "../../../redux/slices/shippingsSlice";

//FIC: Columns Table Definition.
const RastreosColumns = [
    {
      accessorKey: "NumeroGuia",
      header: "NumeroGuia",
      size: 30, //small column
    },
    {
      accessorKey: "IdRepartidorOK",
      header: "IdRepartidorOK",
      size: 30, //small column
    },
    {
      accessorKey: "NombreRepartidor",
      header: "NombreRepartidor",
      size: 150, //small column
    },
    {
      accessorKey: "Alias",
      header: "Alias",
      size: 50, //small column
    },
  ];

  //FIC: Table - FrontEnd.
  const RastreosTable = ({}) => {

    //FIC: controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(true);
    //FIC: controlar el estado de la data de InfoAd.
    const [RastreosData, setRastreosData] = useState([]);
    //FIC: controlar el estado que muesta u oculta la modal de nuevo InfoAd.
    const [RastreosShowModal, setRastreosShowModal] = useState(false);
    
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
          const AllRastreosData = await GetEnviosId(instituto, negocio, entrega, domicilio);
          //Asegurarse de que los datos regresados sean un arreglo para que se pueda mostrar en la tabla
          //En este caso ya que se trata de un subdoc objeto y no subdoc array
          const rastreosData = Array.isArray(AllRastreosData.rastreos)
            ? AllRastreosData.rastreos
            : [AllRastreosData.rastreos];
          console.log("SUBDOC DE RASTREO||SEGUIMIENTO", AllRastreosData.rastreos.seguimiento);
          setRastreosData(rastreosData);
          setLoadingTable(false);
        } catch (error) {
          console.error("Error al obtener los productos en useEffect de RastreosTable:", error);
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
        const row = RastreosData[index];
        //Aqui es donde se decide que hacer con la data que regresa el clic en la fila
        console.log("<<ID DEL DOCUMENTO SELECCIONADO>>:", row.NumeroGuia); //row.id_domicilioOK devuelve solo el id, debe funcionar con todo lo demas
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
    }, [RastreosData]);

    return (
        <Box>
          <Box>
            <MaterialReactTable
              columns={RastreosColumns}
              data={RastreosData}
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
                            setRastreosShowModal(true);
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
                            setRastreosShowModal(true);
                            setIsEditMode(true);
                            setIsDeleteMode(false);
                          }}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                          onClick={() => {
                            setRastreosShowModal(true);
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
          <Dialog open={RastreosShowModal}>
            <RastreosModal
              RastreosShowModal={RastreosShowModal}
              setRastreosShowModal={setRastreosShowModal}
              isEditMode={isEditMode}
              row={isEditMode || isDeleteMode ? editData : null}
              isDeleteMode={isDeleteMode}
              reloadTable={reloadTableData} //Pasar como prop la recarga de la tabla
              selectedShippingData={selectedShippingData}
              selectedEnvioData={selectedEnvioData} //Pasar como prop los datos que sacamos de redux desde ShippingsTable para 
              onClose={() => {                            //usarlos en InfoAdModal y consecuentemente en formik.
                setRastreosShowModal(false);
                setIsEditMode(false); //Resetear el modo de edición
                setEditData(null); //Limpiar la data de edición
                setIsDeleteMode(false);
              }}   
            />
          </Dialog>

        </Box>
      );
  };

export default RastreosTable;