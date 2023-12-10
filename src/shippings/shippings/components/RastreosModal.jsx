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
import { RastreosValues } from "../helpers/RastreosValues";

//SERVICES
import { AddOneRastreo } from "../services/remote/post/AddOneRastreo";

const RastreosModal = ({ RastreosShowModal, setRastreosShowModal, selectedEnvioData, selectedShippingData, 
                          reloadTable, isEditMode, isDeleteMode, row }) => {
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");

    console.log("DATA YA PASADA EN EnvINFOADMODAL AAAAAAA",selectedEnvioData); 
    console.log("MODO DE BORRAR ES:",isDeleteMode);
    console.log("MODO DE ACTUALIZAR ES:",isEditMode);

    //FIC: Definition Formik y Yup
    const formik = useFormik({
        initialValues: {
            NumeroGuia: row ? row.NumeroGuia : "",
            IdRepartidorOK: row ? row.IdRepartidorOK : "",
            NombreRepartidor: row ? row.NombreRepartidor : "",
            Alias: row ? row.Alias : "",
        },
        validationSchema: Yup.object({
            NumeroGuia: Yup.string().required("Campo requerido"),
            IdRepartidorOK: Yup.string().required("Campo requerido"),
            NombreRepartidor: Yup.string().required("Campo requerido"),
            Alias: Yup.string().required("Campo requerido"),
        }),
        onSubmit: async (values) => {
            console.log("FIC: entro al onSubmit despues de hacer click en boton Guardar");

            //FIC: reiniciamos los estados de las alertas de exito y error.
            setMensajeErrorAlert(null);
            setMensajeExitoAlert(null);

            try {
                // if(isDeleteMode){
                //     console.log("SE ESTÁ BORRANDO RAAAAAAAAAH");
                //     // Obtener el ID del subdocumento que se está editando
                //     const subdocumentId = row.NumeroGuia;
                //     //Poner el Id del documento existente para pasar al servicio DELETE
                //     const existingShippingId = selectedShippingData.IdEntregaOK;
                //     const idInstituto = selectedShippingData.IdInstitutoOK;
                //     const idNegocio = selectedShippingData.IdNegocioOK;
                //     const idDomicilio = selectedEnvioData.IdDomicilioOK;

                //     await DeleteOneProducto(idInstituto, idNegocio, existingShippingId, idDomicilio, subdocumentId);
                //     reloadTable();
                //     setMensajeExitoAlert("Rastreo eliminado correctamente");
                // }else{
                    //Usar InfoAdValues para obtener los valores definidos del subdocumento en el archivo del mismo nombre
                    const Rastreos = RastreosValues(values);
                    
                    //Poner el Id del documento existente para pasar al servicio POST
                    const existingShippingId = selectedShippingData.IdEntregaOK;
                    const instituto = selectedShippingData.IdInstitutoOK;
                    const negocio = selectedShippingData.IdNegocioOK;
                    const domicilio = selectedEnvioData.IdDomicilioOK;
    
                    //Pasar los parametros al servicio de POST del archivo AddOneInfoAd.jsx
                    //En el mismo orden se pasa: Id del documento existente || Los valores que el usuario pone en el form y que se sacan
                    //de formik || El objeto con los valores predefinidos (IdEtiquetaOK, IdEtiqueta, Etiqueta,...etc...)
                    // console.log("INFO DE DETAIL_ROW", infoAdSubdocument);
                    await AddOneRastreo(existingShippingId, instituto, negocio, domicilio, Rastreos);
                    reloadTable();
                    setMensajeExitoAlert("Rastreo creado y guardado Correctamente");
                // }
            } catch (e) {
                setMensajeExitoAlert(null);
                console.error("<<ERROR>> en onSubmit:", e);
                setMensajeErrorAlert(isDeleteMode ? "No se pudo eliminar el rastreo" : 
                                     "No se pudo guardar el rastreo");
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
            open={RastreosShowModal}
            onClose={() => setRastreosShowModal(false)}
            fullWidth
        >
            <form onSubmit={formik.handleSubmit}>
                {/* FIC: Aqui va el Titulo de la Modal */}
                <DialogTitle>
                    <Typography component="h6">
                        <strong>{isDeleteMode ? "ELIMINAR RASTREO" : "AGREGAR RASTREO"}</strong>
                    </Typography>
                </DialogTitle>
                {/* FIC: Aqui va un tipo de control por cada Propiedad de Institutos */}
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column' }}
                    dividers
                >
                    {/* FIC: Campos de captura o selección */}
                    <TextField
                        id="NumeroGuia"
                        label="NumeroGuia*"
                        value={formik.values.NumeroGuia}
                        {...commonTextFieldProps}
                        error={ formik.touched.NumeroGuia && Boolean(formik.errors.NumeroGuia) }
                        helperText={ formik.touched.NumeroGuia && formik.errors.NumeroGuia }
                        disabled={isDeleteMode} //Si está eliminando que el campo no se pueda editar
                    />
                    <TextField
                        id="IdRepartidorOK"
                        label="IdRepartidorOK*"
                        value={formik.values.IdRepartidorOK}
                        {...commonTextFieldProps}
                        error={ formik.touched.IdRepartidorOK && Boolean(formik.errors.IdRepartidorOK) }
                        helperText={ formik.touched.IdRepartidorOK && formik.errors.IdRepartidorOK }
                        disabled={isDeleteMode} //Si está eliminando que el campo no se pueda editar
                    />
                    <TextField
                        id="NombreRepartidor"
                        label="NombreRepartidor*"
                        value={formik.values.NombreRepartidor}
                        {...commonTextFieldProps}
                        error={ formik.touched.NombreRepartidor && Boolean(formik.errors.NombreRepartidor) }
                        helperText={ formik.touched.NombreRepartidor && formik.errors.NombreRepartidor }
                        disabled={isDeleteMode} //Si está eliminando que el campo no se pueda editar
                    />
                    <TextField
                        id="Alias"
                        label="Alias*"
                        value={formik.values.Alias}
                        {...commonTextFieldProps}
                        error={ formik.touched.Alias && Boolean(formik.errors.Alias) }
                        helperText={ formik.touched.Alias && formik.errors.Alias }
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
                        onClick={() => setRastreosShowModal(false)}
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
                        <span>{isDeleteMode ? "ELIMINAR" : "GUARDAR"}</span>
                    </LoadingButton>
                </DialogActions>
            </form>
        </Dialog>
    );
};
export default RastreosModal;