import React from "react";
import { Dialog, DialogContent, DialogTitle, Typography, TextField, DialogActions, Box, Alert,
         FormControlLabel, Checkbox, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";

//FIC: Formik - Yup
import { useFormik } from "formik";
import * as Yup from "yup";

//HELPERS
import { EnviosValues } from "../helpers/EnviosValues";

//SERVICES
import { AddOneEnvio } from "../services/remote/post/AddOneEnvio";
import { UpdateOneEnvio } from "../services/remote/put/UpdateOneEnvio";
import { DeleteOneEnvio } from "../services/remote/del/DeleteOneEnvio";

const EnviosModal = ({ EnviosShowModal, setEnviosShowModal, selectedShippingData, reloadTable, isEditMode, isDeleteMode, row }) => {
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
    //Para ver la data que trae el documento completo desde el dispatch de ShippingsTable
    console.log("DATA YA PASADA EN EnviosMODAL AAAAAAA",selectedShippingData); 
    console.log("MODO DE BORRAR ES:",isDeleteMode);
    console.log("MODO DE ACTUALIZAR ES:",isEditMode);

    //FIC: Definition Formik y Yup.IdEntregaBK: row ? row.IdEntregaBK : "",
    const formik = useFormik({
        initialValues: {
            IdDomicilioOK: row ? row.IdDomicilioOK : "",
            IdPaqueteriaOK: row ? row.IdPaqueteriaOK : "",
            IdTipoMetodoEnvio: row ? row.IdTipoMetodoEnvio : "",
            CostoEnvio: row ? row.CostoEnvio : ""
        },
        validationSchema: Yup.object({
            IdDomicilioOK: Yup.string().required("Campo requerido"),
            IdPaqueteriaOK: Yup.string().required("Campo requerido"),
            IdTipoMetodoEnvio: Yup.string().required("Campo requerido"),
            CostoEnvio: Yup.string().required("Campo requerido")
        }),
        onSubmit: async (values) => {
            console.log("FIC: entro al onSubmit despues de hacer click en boton Guardar");

            //FIC: reiniciamos los estados de las alertas de exito y error.
            setMensajeErrorAlert(null);
            setMensajeExitoAlert(null);

            try {
                if(isEditMode){
                    console.log("SE ESTÁ ACTUALIZANDO RAAAAAAAAAH");
                    const EnvioSubdocument = EnviosValues(values);
                    // Obtener el ID del subdocumento que se está editando
                    const subdocumentId = row.IdDomicilioOK;
                    //Poner el Id del documento existente para pasar al servicio PUT
                    const existingShippingId = selectedShippingData.IdEntregaOK;
                    const idInstituto = selectedShippingData.IdInstitutoOK;
                    const idNegocio = selectedShippingData.IdNegocioOK;
                    
                    //Para conservar los subdoc
                    EnvioSubdocument.info_ad = selectedShippingData.envios.info_ad;
                    EnvioSubdocument.productos = selectedShippingData.envios.productos;
                    EnvioSubdocument.estatus = selectedShippingData.envios.estatus;

                    // Llamar al servicio de PUT para actualizar el subdocumento
                    //Poner el objeto de InfoAd = InfoAdValues o sino no genera el detail_row_reg.
                    await UpdateOneEnvio(EnvioSubdocument, idInstituto, idNegocio, existingShippingId, subdocumentId);
                    
                    reloadTable();
                    setMensajeExitoAlert("Envio actualizado correctamente");
                }else if(isDeleteMode){
                    console.log("SE ESTÁ BORRANDO RAAAAAAAAAH");
                    
                    // Obtener el ID del subdocumento que se está editando
                    const subdocumentId = row.IdDomicilioOK;
                    //Poner el Id del documento existente para pasar al servicio DELETE
                    const existingShippingId = selectedShippingData.IdEntregaOK;
                    const idInstituto = selectedShippingData.IdInstitutoOK;
                    const idNegocio = selectedShippingData.IdNegocioOK;

                    await DeleteOneEnvio(idInstituto, idNegocio, existingShippingId, subdocumentId);
                    reloadTable();
                    setMensajeExitoAlert("Envio eliminado correctamente");
                }else{
                    //Usar EnviosValues para obtener los valores definidos del subdocumento en el archivo del mismo nombre
                    const EnvioSubdocument = EnviosValues(values);
                    
                    //Poner el Id del documento existente para pasar al servicio POST
                    const existingShippingId = selectedShippingData.IdEntregaOK;
                    const instituto = selectedShippingData.IdInstitutoOK;
                    const negocio = selectedShippingData.IdNegocioOK;
    
                    //Pasar los parametros al servicio de POST del archivo AddOneInfoAd.jsx
                    //En el mismo orden se pasa: Id del documento existente || Los valores que el usuario pone en el form y que se sacan
                    //de formik || El objeto con los valores predefinidos (IdEtiquetaOK, IdEtiqueta, Etiqueta,...etc...)
                    console.log("INFO DE DETAIL_ROW", EnvioSubdocument);
                    await AddOneEnvio(existingShippingId, instituto, negocio, EnvioSubdocument);
                    reloadTable();
                    setMensajeExitoAlert("Envio creado y guardado Correctamente");
                }
            } catch (e) {
                setMensajeExitoAlert(null);
                console.error("<<ERROR>> en onSubmit:", e);
                setMensajeErrorAlert(isEditMode ? "No se pudo actualizar el envio" : 
                                     isDeleteMode ? "No se pudo eliminar el envio" : 
                                     "No se pudo guardar el envio");
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
            open={EnviosShowModal}
            onClose={() => setEnviosShowModal(false)}
            fullWidth
        >
            <form onSubmit={formik.handleSubmit}>
                {/* FIC: Aqui va el Titulo de la Modal */}
                <DialogTitle>
                    <Typography component="h6">
                        <strong>{isEditMode ? "ACTUALIZAR ENVIO" : isDeleteMode ? "ELIMINAR ENVIO" : "AGREGAR ENVIO"}</strong>
                    </Typography>
                </DialogTitle>
                {/* FIC: Aqui va un tipo de control por cada Propiedad de Institutos */}
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column' }}
                    dividers
                >
                    {/* FIC: Campos de captura o selección */}
                    <TextField
                        id="IdDomicilioOK"
                        label="IdDomicilioOK*"
                        value={formik.values.IdDomicilioOK}
                        {...commonTextFieldProps}
                        error={ formik.touched.IdDomicilioOK && Boolean(formik.errors.IdDomicilioOK) }
                        helperText={ formik.touched.IdDomicilioOK && formik.errors.IdDomicilioOK }
                        disabled={isDeleteMode} //Si está eliminando que el campo no se pueda editar
                    />
                    <TextField
                        id="IdPaqueteriaOK"
                        label="IdPaqueteriaOK*"
                        value={formik.values.IdPaqueteriaOK}
                        {...commonTextFieldProps}
                        error={ formik.touched.IdPaqueteriaOK && Boolean(formik.errors.IdPaqueteriaOK) }
                        helperText={ formik.touched.IdPaqueteriaOK && formik.errors.IdPaqueteriaOK }
                        disabled={isDeleteMode} //Si está eliminando que el campo no se pueda editar
                    />
                    <TextField
                        id="IdTipoMetodoEnvio"
                        label="IdTipoMetodoEnvio*"
                        value={formik.values.IdTipoMetodoEnvio}
                        {...commonTextFieldProps}
                        error={ formik.touched.IdTipoMetodoEnvio && Boolean(formik.errors.IdTipoMetodoEnvio) }
                        helperText={ formik.touched.IdTipoMetodoEnvio && formik.errors.IdTipoMetodoEnvio }
                        disabled={isDeleteMode} //Si está eliminando que el campo no se pueda editar
                    />
                    <TextField
                        id="CostoEnvio"
                        label="CostoEnvio*"
                        value={formik.values.CostoEnvio}
                        {...commonTextFieldProps}
                        error={ formik.touched.CostoEnvio && Boolean(formik.errors.CostoEnvio) }
                        helperText={ formik.touched.CostoEnvio && formik.errors.CostoEnvio }
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
                        onClick={() => setEnviosShowModal(false)}
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
export default EnviosModal;