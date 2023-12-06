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
import { getAllShippings } from "../../services/remote/get/GetAllShippings";

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
  const InfoAdTable = ({ onReloadTable }) => {

    //FIC: controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(true);
    //FIC: controlar el estado de la data de InfoAd.
    const [InfoAdData, setInfoAdData] = useState([]);
    //FIC: controlar el estado que muesta u oculta la modal de nuevo InfoAd.
    const [InfoAdShowModal, setInfoAdShowModal] = useState(false);
    const [reloadTable, setReloadTable] = useState(false);
    const [selectedDocumentId, setSelectedDocumentId] = useState(null); //Estado para guardar el Id seleccionado de la tabla principal
    
    const [isEditMode, setIsEditMode] = useState(false); //Para determinar si la modal está en modo de edicion/agregar (true=editar || false=agregar)
    const [editData, setEditData] = useState(false);//Para saber si hay que rellenar los textfield con datos en caso de estar en modo de edición

    //Con redux sacar la data que se envió del otro archivo (ShippingsTable)
    const selectedShippingData = useSelector((state) => state.shippingsReducer.selectedShippingData);
    // console.log(selectedShippingData);

    useEffect(() => {
      async function fetchData() {
        try {
          //Verifica si tenemos un documento seleccionado en la tabla principal
          if (selectedDocumentId) {
            //Llamar al get para obtener todas las entregas/shippings
            const allShippings = await getAllShippings();
            //filtra los que coincidan con el id de IdEntregaOK
            const infoAdData = allShippings
              .filter((shipping) => shipping.IdEntregaOK === selectedDocumentId)
              //mapea los datos de info_ad y agrega el ID del shipping correspondiente
              .flatMap((shipping) => shipping.info_ad.map((infoAd) => ({ ...infoAd, IdEntregaOK: shipping.IdEntregaOK })));
            //Actualiza el estado de infoAdData con los datos obtenidos
            setInfoAdData(infoAdData);
            setLoadingTable(false);
            //Imprimimos en consola un mensaje para ver los datos que obtuvimos
            console.log("InfoAdData ACTUALIZADAAAAAAAAAAAAAAA:", infoAdData);
          }
        } catch (error) {
          console.error("Error al obtener info_ad:", error);
        }
      }
    
      fetchData();
    }, [reloadTable, selectedDocumentId]); // Si estos cambian se activa la ejecución de este useEffect
    
    
    useEffect(() => {
      //Verificar si hay datos de shipping seleccionados en la tabla principal
      if (selectedShippingData) {
        //Actualiza selectedDocumentId con el IdEntregaOK pasado en selectedShippingData
        setSelectedDocumentId(selectedShippingData.IdEntregaOK);
      }
    }, [selectedShippingData]); //Se ejecuta cada que cambia selectedShippingData
    
    // Añadir un "borrado" para cuando no se tenga un documento seleccionado en la tabla principal no mostrar datos.
    useEffect(() => {
      return () => {
        setInfoAdData([]);
        setLoadingTable(true);
      };
    }, []);

    useEffect(() => {
      const handleRowClick = (index) => {
        const row = InfoAdData[index];
        //Aqui es donde se decide que hacer con la data que regresa el clic en la fila
        console.log("<<ID DEL DOCUMENTO SELECCIONADO>>:", row.IdEntregaOK); //row.id_domicilioOK devuelve solo el id, debe funcionar con todo lo demas
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
    }, [InfoAdData]);

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
                          onClick={() => {
                            setInfoAdShowModal(true);
                            setIsEditMode(false);
                            setEditData(null);
                            }}>
                            <AddCircleIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                          onClick={() => {
                            setInfoAdShowModal(true);
                          }}>
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
              isEditMode={isEditMode}
              row={isEditMode ? editData : null}
              reloadTable={() => setReloadTable(prevState => !prevState)} // Pasa la función para recargar la tabla
              selectedShippingData={selectedShippingData} //Pasar como prop los datos que sacamos de redux desde ShippingsTable para 
              onClose={() => setInfoAdShowModal(false)}   //usarlos en InfoAdModal y consecuentemente en formik.
            />
          </Dialog>

        </Box>
      );
  };

  export default InfoAdTable;