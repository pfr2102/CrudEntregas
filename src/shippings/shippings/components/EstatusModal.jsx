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
import { EstatusValues } from "../helpers/EstatusValues";

//SERVICES
import { AddOneEstatus } from "../services/remote/post/AddOneEstatus";
import { UpdateAllEstatus } from "../services/remote/put/UpdateAllEstatus";

const EstatusModal = ({ EstatusShowModal, setEstatusShowModal, selectedEnvioData, selectedShippingData, 
                          reloadTable, isEditMode, isDeleteMode, row }) => {
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");

    const options = [
        'IdEstatusEnvio-IdEnProceso',
        'IdEstatusEnvio-IdListoEnviar',
        'IdEstatusEnvio-IdEsperaRepartidor',
        'IdEstatusEnvio-IdEntregaRepartidor',
        'IdEstatusEnvio-IdEnTransito',
        'IdEstatusEnvio-IdLlegaDestino',
        'IdEstatusEnvio-IdRecibeCliente',
        'IdEstatusEnvio-IdRechazaCliente',
        'IdEstatusEnvio-IdDevolucionRecibida',
        'IdEstatusEnvio-IdConcluido',
    ];

    console.log("DATA YA PASADA EN EnvINFOADMODAL AAAAAAA",selectedEnvioData); 
    console.log("MODO DE BORRAR ES:",isDeleteMode);
    console.log("MODO DE ACTUALIZAR ES:",isEditMode);

    //FIC: Definition Formik y Yup
    const formik = useFormik({
        initialValues: {
            IdTipoEstatusOK: "",
            Actual: "",
            Observacion: "",
        },
        validationSchema: Yup.object({
            IdTipoEstatusOK: Yup.string().required("Campo requerido"),
            Actual: Yup.string().required("Campo requerido"),
            Observacion: Yup.string().required("Campo requerido"),
        }),
        onSubmit: async (values) => {
            console.log("FIC: entro al onSubmit despues de hacer click en boton Guardar");

            //FIC: reiniciamos los estados de las alertas de exito y error.
            setMensajeErrorAlert(null);
            setMensajeExitoAlert(null);

            try {
                // Convertir el valor del checkbox a "S" o "N"
                const actualValue = values.Actual ? "S" : "N";
                // Usar InfoAdValues para obtener los valores definidos del subdocumento en el archivo del mismo nombre
                const Estatus = EstatusValues({ ...values, Actual: actualValue });

                // Poner el Id del documento existente para pasar al servicio POST
                const existingShippingId = selectedShippingData.IdEntregaOK;
                const instituto = selectedShippingData.IdInstitutoOK;
                const negocio = selectedShippingData.IdNegocioOK;
                const domicilio = selectedEnvioData.IdDomicilioOK;

                // Realizar la actualización a todos los campos antes de agregar un nuevo estatus
                await UpdateAllEstatus(existingShippingId, instituto, negocio, domicilio, { Actual: "N" });

                // Pasar los parámetros al servicio de POST del archivo AddOneInfoAd.jsx
                // En el mismo orden se pasa: Id del documento existente || Los valores que el usuario pone en el form y que se sacan
                // de formik || El objeto con los valores predefinidos
                await AddOneEstatus(existingShippingId, instituto, negocio, domicilio, Estatus);
                reloadTable();
                setMensajeExitoAlert("Estatus creado y guardado correctamente");
            } catch (e) {
                setMensajeExitoAlert(null);
                console.error("<<ERROR>> en onSubmit:", e);
                setMensajeErrorAlert("No se pudo guardar el estatus");
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
            open={EstatusShowModal}
            onClose={() => setEstatusShowModal(false)}
            fullWidth
        >
            <form onSubmit={formik.handleSubmit}>
                {/* FIC: Aqui va el Titulo de la Modal */}
                <DialogTitle>
                    <Typography component="h6">
                        <strong>{"AGREGAR ESTATUS"}</strong>
                    </Typography>
                </DialogTitle>
                {/* FIC: Aqui va un tipo de control por cada Propiedad de Institutos */}
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column' }}
                    dividers
                >
                    {/* FIC: Campos de captura o selección */}
                    {/* <TextField
                        id="IdTipoEstatusOK"
                        label="IdTipoEstatusOK*"
                        value={formik.values.IdTipoEstatusOK}
                        {...commonTextFieldProps}
                        error={ formik.touched.IdTipoEstatusOK && Boolean(formik.errors.IdTipoEstatusOK) }
                        helperText={ formik.touched.IdTipoEstatusOK && formik.errors.IdTipoEstatusOK }
                    /> */}
                    <Select
                        id="IdTipoEstatusOK" 
                        label="IdTipoEstatusOK*" 
                        value={formik.values.IdTipoEstatusOK}
                        onChange={(event) => formik.setFieldValue("IdTipoEstatusOK", event.target.value)}
                        error={formik.touched.IdTipoEstatusOK && Boolean(formik.errors.IdTipoEstatusOK)}
                        helperText={formik.touched.IdTipoEstatusOK && formik.errors.IdTipoEstatusOK}
                    >
                        {options.map((option, index) => (
                            <MenuItem key={index} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                    {/* <TextField
                        id="Actual"
                        label="Actual*"
                        value={formik.values.Actual}
                        {...commonTextFieldProps}
                        error={ formik.touched.Actual && Boolean(formik.errors.Actual) }
                        helperText={ formik.touched.Actual && formik.errors.Actual }
                    /> */}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formik.values.Actual}
                                onChange={(e) => formik.setFieldValue('Actual', e.target.checked)}
                                name="Actual"
                                color="primary"
                                disabled={!!mensajeExitoAlert}
                            />
                        }
                        label="Actual"
                    />
                    <TextField
                        id="Observacion"
                        label="Observacion*"
                        value={formik.values.Observacion}
                        {...commonTextFieldProps}
                        error={ formik.touched.Observacion && Boolean(formik.errors.Observacion) }
                        helperText={ formik.touched.Observacion && formik.errors.Observacion }
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
                        onClick={() => setEstatusShowModal(false)}
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
                        <span>{"GUARDAR"}</span>
                    </LoadingButton>
                </DialogActions>
            </form>
        </Dialog>
    );
};
export default EstatusModal;