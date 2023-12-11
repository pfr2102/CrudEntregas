import React from "react";
import { Dialog, DialogContent, DialogTitle, Typography, TextField, DialogActions, Box, Alert,
         FormControlLabel, Checkbox, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { useState, useEffect } from "react";

//FIC: Formik - Yup
import { useFormik } from "formik";
import * as Yup from "yup";

//HELPERS
import { ProductosValues } from "../helpers/ProductosValues";

//SERVICES
import { AddOneProducto } from "../services/remote/post/AddOneProducto";
import { UpdateOneProducto } from "../services/remote/put/UpdateOneProducto";
import { DeleteOneProducto } from "../services/remote/del/DeleteOneProducto";
import { GetAllOrders } from "../services/remote/get/GetAllOrders";

const ProductosModal = ({ ProductosShowModal, setProductosShowModal, selectedEnvioData, selectedShippingData, 
                          reloadTable, isEditMode, isDeleteMode, row }) => {
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
    const IdOrdenOKK = selectedShippingData.IdOrdenOK;
    console.log("ORDENAAAAAAA", IdOrdenOKK);
    const [OrdenValuesLabel, setOrdenValuesLabel] = useState([]);

    //FIC: en cuanto se abre la modal llama el metodo
    //que ejecuta la API que trae todas las etiquetas de la BD.
    useEffect(() => {
        getDataSelectOrdenType();
    }, []);

    //FIC: Ejecutamos la API que obtiene todas las etiquetas
    //y filtramos solo la etiqueta de TipoMetodoEnvio de cat_etiquetas
    //para que los ID y Nombres se agreguen como items en el
    //control <Select> del campo IdEtiquetaOK en la Modal.
    async function getDataSelectOrdenType() {
        try {
            const Orders = await GetAllOrders();
            const OrdenTypes = Orders.find(
                (label) => label.IdOrdenOK === IdOrdenOKK
            );
            console.log("ORDENTYPES AAAAAAA", OrdenTypes.ordenes_detalle);
            setOrdenValuesLabel(OrdenTypes.ordenes_detalle);
        } catch (e) {
            console.error("Error al obtener ordenes_detalles para ordenes de productos:", e);
        }
    }

    console.log("DATA YA PASADA EN EnvINFOADMODAL AAAAAAA",selectedEnvioData); 
    console.log("MODO DE BORRAR ES:",isDeleteMode);
    console.log("MODO DE ACTUALIZAR ES:",isEditMode);

    //FIC: Definition Formik y Yup
    const formik = useFormik({
        initialValues: {
            IdProdServOK: row ? row.IdProdServOK : "",
            IdPresentaOK: row ? row.IdPresentaOK : "",
            DesProdServ: row ? row.DesProdServ : "",
            DesPresenta: row ? row.DesPresenta : "",
            CantidadPed: row ? row.CantidadPed : null,
            CantidadEnt: row ? row.CantidadEnt : null,
        },
        validationSchema: Yup.object({
            IdProdServOK: Yup.string().required("Campo requerido"),
            IdPresentaOK: Yup.string().required("Campo requerido"),
            DesProdServ: Yup.string().required("Campo requerido"),
            DesPresenta: Yup.string().required("Campo requerido"),
            CantidadPed: Yup.string().required("Campo requerido"),
            CantidadEnt: Yup.string().required("Campo requerido"),
        }),
        onSubmit: async (values) => {
            console.log("FIC: entro al onSubmit despues de hacer click en boton Guardar");

            //FIC: reiniciamos los estados de las alertas de exito y error.
            setMensajeErrorAlert(null);
            setMensajeExitoAlert(null);

            try {
                if(isEditMode){
                    console.log("SE ESTÁ ACTUALIZANDO RAAAAAAAAAH");
                    const Productos = ProductosValues(values);
                    // Obtener el ID del subdocumento que se está editando
                    const subdocumentId = row.IdPresentaOK;
                    //Poner el Id del documento existente para pasar al servicio PUT
                    const existingShippingId = selectedShippingData.IdEntregaOK;
                    const idInstituto = selectedShippingData.IdInstitutoOK;
                    const idNegocio = selectedShippingData.IdNegocioOK;
                    const idDomicilio = selectedEnvioData.IdDomicilioOK;

                    // InfoAd.IdEtiquetaOK = row.IdEtiquetaOK
                    // InfoAd.IdEtiqueta = row.IdEtiqueta
                    // InfoAd.Etiqueta = row.Etiqueta
                    // InfoAd.Valor = row.Valor
                    // InfoAd.IdTipoSeccionOK = row.IdTipoSeccionOK
                    // InfoAd.Secuencia = row.Secuencia

                    // Llamar al servicio de PUT para actualizar el subdocumento
                    await UpdateOneProducto(Productos, idInstituto, idNegocio, existingShippingId, idDomicilio, subdocumentId);
                    
                    reloadTable();
                    setMensajeExitoAlert("Producto actualizado correctamente");
                }else if(isDeleteMode){
                    console.log("SE ESTÁ BORRANDO RAAAAAAAAAH");
                    // Obtener el ID del subdocumento que se está editando
                    const subdocumentId = row.IdPresentaOK;
                    //Poner el Id del documento existente para pasar al servicio DELETE
                    const existingShippingId = selectedShippingData.IdEntregaOK;
                    const idInstituto = selectedShippingData.IdInstitutoOK;
                    const idNegocio = selectedShippingData.IdNegocioOK;
                    const idDomicilio = selectedEnvioData.IdDomicilioOK;

                    await DeleteOneProducto(idInstituto, idNegocio, existingShippingId, idDomicilio, subdocumentId);
                    reloadTable();
                    setMensajeExitoAlert("Producto eliminado correctamente");
                }else{
                    //Usar InfoAdValues para obtener los valores definidos del subdocumento en el archivo del mismo nombre
                    const Productos = ProductosValues(values);
                    
                    //Poner el Id del documento existente para pasar al servicio POST
                    const existingShippingId = selectedShippingData.IdEntregaOK;
                    const instituto = selectedShippingData.IdInstitutoOK;
                    const negocio = selectedShippingData.IdNegocioOK;
                    const domicilio = selectedEnvioData.IdDomicilioOK;
    
                    //Pasar los parametros al servicio de POST del archivo AddOneInfoAd.jsx
                    //En el mismo orden se pasa: Id del documento existente || Los valores que el usuario pone en el form y que se sacan
                    //de formik || El objeto con los valores predefinidos (IdEtiquetaOK, IdEtiqueta, Etiqueta,...etc...)
                    // console.log("INFO DE DETAIL_ROW", infoAdSubdocument);
                    await AddOneProducto(existingShippingId, instituto, negocio, domicilio, Productos);
                    reloadTable();
                    setMensajeExitoAlert("Producto creado y guardado Correctamente");
                }
            } catch (e) {
                setMensajeExitoAlert(null);
                console.error("<<ERROR>> en onSubmit:", e);
                setMensajeErrorAlert(isEditMode ? "No se pudo actualizar los productos" : 
                                     isDeleteMode ? "No se pudo eliminar los productos" : 
                                     "No se pudo guardar los productos");
            }
        },
    });

    //FIC: props structure for TextField Control.
    const commonTextFieldProps = {
        onChange: formik.handleChange,
        onBlur: formik.handleBlur,
        fullWidth: true,
        margin: "dense",
        disabled: !!mensajeExitoAlert,
    };

    return(
        <Dialog
            open={ProductosShowModal}
            onClose={() => setProductosShowModal(false)}
            fullWidth
        >
            <form onSubmit={formik.handleSubmit}>
                {/* FIC: Aqui va el Titulo de la Modal */}
                <DialogTitle>
                    <Typography component="h6">
                        <strong>{isEditMode ? "ACTUALIZAR PRODUCTO" : isDeleteMode ? "ELIMINAR PRODUCTO" : "AGREGAR PRODUCTO"}</strong>
                    </Typography>
                </DialogTitle>
                {/* FIC: Aqui va un tipo de control por cada Propiedad de Institutos */}
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column' }}
                    dividers
                >
                    {/* FIC: Campos de captura o selección */}
                    {/* <TextField
                        id="IdProdServOK"
                        label="IdProdServOK*"
                        value={formik.values.IdProdServOK}
                        {...commonTextFieldProps}
                        error={ formik.touched.IdProdServOK && Boolean(formik.errors.IdProdServOK) }
                        helperText={ formik.touched.IdProdServOK && formik.errors.IdProdServOK }
                        disabled={isDeleteMode} //Si está eliminando que el campo no se pueda editar
                    /> */}
                    <Select
                        value={formik.values.IdProdServOK}
                        label="Selecciona una opción"
                        onChange={(event) => {
                            const selectedId = event.target.value;
                            const selectedOption = OrdenValuesLabel.find((tipoEtiq) => tipoEtiq.IdProdServOK === selectedId);

                            formik.setValues({
                                ...formik.values,
                                IdProdServOK: selectedId,
                                IdPresentaOK: selectedOption?.IdPresentaOK || "", //Los de la derecha son los nombres en 
                                DesPresenta: selectedOption?.DesPresentaPS || "", //la bd/modelo del otro equipo, NO los nuestros
                                CantidadPed: selectedOption?.Cantidad || "",
                            });
                        }}
                        name="IdProdServOK"
                        onBlur={formik.handleBlur}
                        disabled={!!mensajeExitoAlert}
                    >
                        {OrdenValuesLabel.map((tipoEtiq) => (
                            <MenuItem
                                value={`${tipoEtiq.IdProdServOK}`}
                                key={tipoEtiq.IdProdServOK}
                            >
                                {tipoEtiq.IdProdServOK}
                            </MenuItem>
                        ))}
                    </Select>

                    <TextField
                        id="IdPresentaOK"
                        label="IdPresentaOK*"
                        value={formik.values.IdPresentaOK}
                        {...commonTextFieldProps}
                        error={ formik.touched.IdPresentaOK && Boolean(formik.errors.IdPresentaOK) }
                        helperText={ formik.touched.IdPresentaOK && formik.errors.IdPresentaOK }
                        disabled={true} //Si está eliminando que el campo no se pueda editar
                    />
                    <TextField
                        id="DesProdServ"
                        label="DesProdServ*"
                        value={formik.values.DesProdServ}
                        {...commonTextFieldProps}
                        error={ formik.touched.DesProdServ && Boolean(formik.errors.DesProdServ) }
                        helperText={ formik.touched.DesProdServ && formik.errors.DesProdServ }
                        disabled={isDeleteMode} //Si está eliminando que el campo no se pueda editar
                    />
                    <TextField
                        id="DesPresenta"
                        label="DesPresenta*"
                        value={formik.values.DesPresenta}
                        {...commonTextFieldProps}
                        error={ formik.touched.DesPresenta && Boolean(formik.errors.DesPresenta) }
                        helperText={ formik.touched.DesPresenta && formik.errors.DesPresenta }
                        disabled={true} //Si está eliminando que el campo no se pueda editar
                    />
                    <TextField
                        id="CantidadPed"
                        label="CantidadPed*"
                        value={formik.values.CantidadPed}
                        {...commonTextFieldProps}
                        error={ formik.touched.CantidadPed && Boolean(formik.errors.CantidadPed) }
                        helperText={ formik.touched.CantidadPed && formik.errors.CantidadPed }
                        disabled={true} //Si está eliminando que el campo no se pueda editar
                    />
                    <TextField
                        id="CantidadEnt"
                        label="CantidadEnt*"
                        value={formik.values.CantidadEnt}
                        {...commonTextFieldProps}
                        error={ formik.touched.CantidadEnt && Boolean(formik.errors.CantidadEnt) }
                        helperText={ formik.touched.CantidadEnt && formik.errors.CantidadEnt }
                        disabled={isDeleteMode} //Si está eliminando que el campo no se pueda editar
                    />
                </DialogContent>
                {/* FIC: Aqui van las acciones del usuario como son las alertas o botones */}
                <DialogActions
                    sx={{ display: 'flex', flexDirection: 'row' }}
                >
                    <Box m="auto">
                        {console.log("mensajeExitoAlert", mensajeExitoAlert)}
                        {console.log("mensajeErrorAlert", mensajeErrorAlert)}
                        {mensajeErrorAlert && (
                        <Alert severity="error">
                            <b>¡ERROR!</b> ─ {mensajeErrorAlert}
                        </Alert>
                        )}
                        {mensajeExitoAlert && (
                        <Alert severity="success">
                            <b>¡ÉXITO!</b> ─ {mensajeExitoAlert}
                        </Alert>
                        )}
                    </Box>
                    {/* FIC: Boton de Cerrar. */}
                    <LoadingButton
                        color="secondary"
                        loadingPosition="start"
                        startIcon={<CloseIcon />}
                        variant="outlined"
                        onClick={() => setProductosShowModal(false)}
                    >
                        <span>CERRAR</span>
                    </LoadingButton>
                    {/* FIC: Boton de Guardar. */}
                    <LoadingButton
                        style={{ backgroundColor: isDeleteMode ? "#ff0000" : "" }}
                        color="primary"
                        loadingPosition="start"
                        startIcon={<SaveIcon />}
                        variant="contained"
                        type="submit"
                        disabled={!!mensajeExitoAlert}
                    >
                        <span>{isEditMode ? "ACTUALIZAR" : isDeleteMode ? "ELIMINAR" : "GUARDAR"}</span>
                    </LoadingButton>
                </DialogActions>
            </form>
        </Dialog>
    );
};
export default ProductosModal;