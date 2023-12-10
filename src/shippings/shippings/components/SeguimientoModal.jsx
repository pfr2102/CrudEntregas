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
import { SeguimientoValues } from "../helpers/SeguimientoValues";

//SERVICES
import { AddOneSeguimiento } from "../services/remote/post/AddOneSeguimiento";
import { UpdateOneSeguimiento } from "../services/remote/put/UpdateOneSeguimiento";
import { DeleteOneSeguimiento } from "../services/remote/del/DeleteOneSeguimiento";

const SeguimientoModal = ({ SeguimientoShowModal, setSeguimientoShowModal, selectedEnvioData, selectedShippingData, 
                          reloadTable, isEditMode, isDeleteMode, row }) => {
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");

    console.log("DATA YA PASADA EN EnvINFOADMODAL AAAAAAA",selectedEnvioData); 
    console.log("MODO DE BORRAR ES:",isDeleteMode);
    console.log("MODO DE ACTUALIZAR ES:",isEditMode);

    //FIC: Definition Formik y Yup
    const formik = useFormik({
        initialValues: {
            Ubicacion: row ? row.Ubicacion : "",
            DesUbicacion: row ? row.DesUbicacion : "",
            Referencias: row ? row.Referencias : "",
            Observacion: row ? row.Observacion : "",
            FechaReg: row ? row.FechaReg : "",
            UsuarioReg: row ? row.UsuarioReg : "",
        },
        validationSchema: Yup.object({
            Ubicacion: Yup.string().required("Campo requerido"),
            DesUbicacion: Yup.string().required("Campo requerido"),
            Referencias: Yup.string().required("Campo requerido"),
            Observacion: Yup.string().required("Campo requerido"),
            FechaReg: Yup.string().required("Campo requerido"),
            UsuarioReg: Yup.string().required("Campo requerido"),
        }),
        onSubmit: async (values) => {
            console.log("FIC: entro al onSubmit despues de hacer click en boton Guardar");

            //FIC: reiniciamos los estados de las alertas de exito y error.
            setMensajeErrorAlert(null);
            setMensajeExitoAlert(null);

            try {
                if(isEditMode){
                    console.log("SE ESTÁ ACTUALIZANDO RAAAAAAAAAH");
                    const Seguimiento = SeguimientoValues(values);
                    // Obtener el ID del subdocumento que se está editando
                    const subdocumentId = row.Ubicacion;
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
                    await UpdateOneSeguimiento(Seguimiento, idInstituto, idNegocio, existingShippingId, idDomicilio, subdocumentId);
                    
                    reloadTable();
                    setMensajeExitoAlert("Producto actualizado correctamente");
                }else if(isDeleteMode){
                    console.log("SE ESTÁ BORRANDO RAAAAAAAAAH");
                    // Obtener el ID del subdocumento que se está editando
                    const subdocumentId = row.Ubicacion;
                    //Poner el Id del documento existente para pasar al servicio DELETE
                    const existingShippingId = selectedShippingData.IdEntregaOK;
                    const idInstituto = selectedShippingData.IdInstitutoOK;
                    const idNegocio = selectedShippingData.IdNegocioOK;
                    const idDomicilio = selectedEnvioData.IdDomicilioOK;

                    await DeleteOneSeguimiento(idInstituto, idNegocio, existingShippingId, idDomicilio, subdocumentId);
                    reloadTable();
                    setMensajeExitoAlert("Producto eliminado correctamente");
                }else{
                    //Usar InfoAdValues para obtener los valores definidos del subdocumento en el archivo del mismo nombre
                    const Seguimiento = SeguimientoValues(values);
                    
                    //Poner el Id del documento existente para pasar al servicio POST
                    const existingShippingId = selectedShippingData.IdEntregaOK;
                    const instituto = selectedShippingData.IdInstitutoOK;
                    const negocio = selectedShippingData.IdNegocioOK;
                    const domicilio = selectedEnvioData.IdDomicilioOK;
    
                    //Pasar los parametros al servicio de POST del archivo AddOneInfoAd.jsx
                    //En el mismo orden se pasa: Id del documento existente || Los valores que el usuario pone en el form y que se sacan
                    //de formik || El objeto con los valores predefinidos (IdEtiquetaOK, IdEtiqueta, Etiqueta,...etc...)
                    // console.log("INFO DE DETAIL_ROW", infoAdSubdocument);
                    await AddOneSeguimiento(existingShippingId, instituto, negocio, domicilio, Seguimiento);
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
            open={SeguimientoShowModal}
            onClose={() => setSeguimientoShowModal(false)}
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
                    <TextField
                        id="Ubicacion"
                        label="Ubicacion*"
                        value={formik.values.Ubicacion}
                        {...commonTextFieldProps}
                        error={ formik.touched.Ubicacion && Boolean(formik.errors.Ubicacion) }
                        helperText={ formik.touched.Ubicacion && formik.errors.Ubicacion }
                        disabled={isDeleteMode} //Si está eliminando que el campo no se pueda editar
                    />
                    <TextField
                        id="DesUbicacion"
                        label="DesUbicacion*"
                        value={formik.values.DesUbicacion}
                        {...commonTextFieldProps}
                        error={ formik.touched.DesUbicacion && Boolean(formik.errors.DesUbicacion) }
                        helperText={ formik.touched.DesUbicacion && formik.errors.DesUbicacion }
                        disabled={isDeleteMode} //Si está eliminando que el campo no se pueda editar
                    />
                    <TextField
                        id="Referencias"
                        label="Referencias*"
                        value={formik.values.Referencias}
                        {...commonTextFieldProps}
                        error={ formik.touched.Referencias && Boolean(formik.errors.Referencias) }
                        helperText={ formik.touched.Referencias && formik.errors.Referencias }
                        disabled={isDeleteMode} //Si está eliminando que el campo no se pueda editar
                    />
                    <TextField
                        id="Observacion"
                        label="Observacion*"
                        value={formik.values.Observacion}
                        {...commonTextFieldProps}
                        error={ formik.touched.Observacion && Boolean(formik.errors.Observacion) }
                        helperText={ formik.touched.Observacion && formik.errors.Observacion }
                        disabled={isDeleteMode} //Si está eliminando que el campo no se pueda editar
                    />
                    <TextField
                        id="FechaReg"
                        label="FechaReg*"
                        value={formik.values.FechaReg}
                        {...commonTextFieldProps}
                        error={ formik.touched.FechaReg && Boolean(formik.errors.FechaReg) }
                        helperText={ formik.touched.FechaReg && formik.errors.FechaReg }
                        disabled={isDeleteMode} //Si está eliminando que el campo no se pueda editar
                    />
                    <TextField
                        id="UsuarioReg"
                        label="UsuarioReg*"
                        value={formik.values.UsuarioReg}
                        {...commonTextFieldProps}
                        error={ formik.touched.UsuarioReg && Boolean(formik.errors.UsuarioReg) }
                        helperText={ formik.touched.UsuarioReg && formik.errors.UsuarioReg }
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
                        onClick={() => setSeguimientoShowModal(false)}
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
export default SeguimientoModal;