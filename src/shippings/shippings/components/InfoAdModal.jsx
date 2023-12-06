import React from "react";
import { Dialog, DialogContent, DialogTitle, Typography, TextField, DialogActions, Box, Alert } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";

//FIC: Formik - Yup
import { useFormik } from "formik";
import * as Yup from "yup";

//HELPERS
import { InfoAdValues } from "../helpers/InfoAdValues";

//SERVICES
import { AddOneInfoAd } from "../services/remote/post/AddOneInfoAd";
import { UpdateOneInfoAd } from "../services/remote/put/UpdateOneInfoAd";
import { DeleteOneInfoAd } from "../services/remote/del/DeleteOneInfoAd";

const InfoAdModal = ({ InfoAdShowModal, setInfoAdShowModal, selectedShippingData, reloadTable, isEditMode, isDeleteMode, row }) => {
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
    //Para ver la data que trae el documento completo desde el dispatch de ShippingsTable
    console.log("DATA YA PASADA EN INFOADMODAL AAAAAAA",selectedShippingData); 
    console.log("MODO DE BORRAR ES:",isDeleteMode);
    console.log("MODO DE ACTUALIZAR ES:",isEditMode);

    //FIC: Definition Formik y Yup.IdEntregaBK: row ? row.IdEntregaBK : "",
    const formik = useFormik({
        initialValues: {
            IdEtiquetaOK: row ? row.IdEtiquetaOK : "",
            IdEtiqueta: row ? row.IdEtiqueta : "",
            Etiqueta: row ? row.Etiqueta : "",
            Valor: row ? row.Valor : "",
            IdTipoSeccionOK: row ? row.IdTipoSeccionOK : "",
            Secuencia: row ? row.Secuencia : null,
        },
        validationSchema: Yup.object({
            IdEtiquetaOK: Yup.string().required("Campo requerido"),
            IdEtiqueta: Yup.string().required("Campo requerido"),
            Etiqueta: Yup.string().required("Campo requerido"),
            Valor: Yup.string().required("Campo requerido"),
            IdTipoSeccionOK: Yup.string().required("Campo requerido"),
            Secuencia: Yup.string().required("Campo requerido"),
        }),
        onSubmit: async (values) => {
            console.log("FIC: entro al onSubmit despues de hacer click en boton Guardar");

            //FIC: reiniciamos los estados de las alertas de exito y error.
            setMensajeErrorAlert(null);
            setMensajeExitoAlert(null);

            try {
                if(isEditMode){
                    console.log("SE ESTÁ ACTUALIZANDO RAAAAAAAAAH");
                    const InfoAd = InfoAdValues(values);
                    // Obtener el ID del subdocumento que se está editando
                    const subdocumentId = row.IdEtiquetaOK;
                    //Poner el Id del documento existente para pasar al servicio PUT
                    const existingShippingId = selectedShippingData.IdEntregaOK;
                    const idInstituto = selectedShippingData.IdInstitutoOK;
                    const idNegocio = selectedShippingData.IdNegocioOK;

                    InfoAd.IdEtiquetaOK = row.IdEtiquetaOK
                    InfoAd.IdEtiqueta = row.IdEtiqueta
                    InfoAd.Etiqueta = row.Etiqueta
                    InfoAd.Valor = row.Valor
                    InfoAd.IdTipoSeccionOK = row.IdTipoSeccionOK
                    InfoAd.Secuencia = row.Secuencia

                    // Llamar al servicio de PUT para actualizar el subdocumento
                    await UpdateOneInfoAd(values, idInstituto, idNegocio, existingShippingId, subdocumentId);
                    
                    reloadTable();
                    setMensajeExitoAlert("Info Adicional actualizada correctamente");
                }else if(isDeleteMode){
                    console.log("SE ESTÁ BORRANDO RAAAAAAAAAH");
                    const InfoAd = InfoAdValues(values);
                    // Obtener el ID del subdocumento que se está editando
                    const subdocumentId = row.IdEtiquetaOK;
                    //Poner el Id del documento existente para pasar al servicio DELETE
                    const existingShippingId = selectedShippingData.IdEntregaOK;
                    const idInstituto = selectedShippingData.IdInstitutoOK;
                    const idNegocio = selectedShippingData.IdNegocioOK;

                    await DeleteOneInfoAd(idInstituto, idNegocio, existingShippingId, subdocumentId);
                    reloadTable();
                    setMensajeExitoAlert("Info Adicional eliminada correctamente");
                }else{
                    //Usar InfoAdValues para obtener los valores definidos del subdocumento en el archivo del mismo nombre
                    const infoAdSubdocument = InfoAdValues(values);
                    
                    //Poner el Id del documento existente para pasar al servicio POST
                    const existingShippingId = selectedShippingData.IdEntregaOK;
                    const instituto = selectedShippingData.IdInstitutoOK;
                    const negocio = selectedShippingData.IdNegocioOK;
    
                    //Pasar los parametros al servicio de POST del archivo AddOneInfoAd.jsx
                    //En el mismo orden se pasa: Id del documento existente || Los valores que el usuario pone en el form y que se sacan
                    //de formik || El objeto con los valores predefinidos (IdEtiquetaOK, IdEtiqueta, Etiqueta,...etc...)
                    await AddOneInfoAd(existingShippingId, instituto, negocio, values, infoAdSubdocument);
                    reloadTable();
                    setMensajeExitoAlert("Info Adicional creada y guardada Correctamente");
                }
            } catch (e) {
                setMensajeExitoAlert(null);
                setMensajeErrorAlert(isEditMode ? "No se pudo actualizar la info adicional" : 
                                     isDeleteMode ? "No se pudo eliminar la info adicional" : 
                                     "No se pudo guardar la info adicional");
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
            open={InfoAdShowModal}
            onClose={() => setInfoAdShowModal(false)}
            fullWidth
        >
            <form onSubmit={formik.handleSubmit}>
                {/* FIC: Aqui va el Titulo de la Modal */}
                <DialogTitle>
                    <Typography component="h6">
                        <strong>{isEditMode ? "ACTUALIZAR INFO ADICIONAL" : isDeleteMode ? "ELIMINAR INFO ADICIONAL" : "AGREGAR INFO ADICIONAL"}</strong>
                    </Typography>
                </DialogTitle>
                {/* FIC: Aqui va un tipo de control por cada Propiedad de Institutos */}
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column' }}
                    dividers
                >
                    {/* FIC: Campos de captura o selección */}
                    <TextField
                        id="IdEtiquetaOK"
                        label="IdEtiquetaOK*"
                        value={formik.values.IdEtiquetaOK}
                        {...commonTextFieldProps}
                        error={ formik.touched.IdEtiquetaOK && Boolean(formik.errors.IdEtiquetaOK) }
                        helperText={ formik.touched.IdEtiquetaOK && formik.errors.IdEtiquetaOK }
                        disabled={isDeleteMode} //Si está eliminando que el campo no se pueda editar
                    />
                    <TextField
                        id="IdEtiqueta"
                        label="IdEtiqueta*"
                        value={formik.values.IdEtiqueta}
                        {...commonTextFieldProps}
                        error={ formik.touched.IdEtiqueta && Boolean(formik.errors.IdEtiqueta) }
                        helperText={ formik.touched.IdEtiqueta && formik.errors.IdEtiqueta }
                        disabled={isDeleteMode} //Si está eliminando que el campo no se pueda editar
                    />
                    <TextField
                        id="Etiqueta"
                        label="Etiqueta*"
                        value={formik.values.Etiqueta}
                        {...commonTextFieldProps}
                        error={ formik.touched.Etiqueta && Boolean(formik.errors.Etiqueta) }
                        helperText={ formik.touched.Etiqueta && formik.errors.Etiqueta }
                        disabled={isDeleteMode} //Si está eliminando que el campo no se pueda editar
                    />
                    <TextField
                        id="Valor"
                        label="Valor*"
                        value={formik.values.Valor}
                        {...commonTextFieldProps}
                        error={ formik.touched.Valor && Boolean(formik.errors.Valor) }
                        helperText={ formik.touched.Valor && formik.errors.Valor }
                        disabled={isDeleteMode} //Si está eliminando que el campo no se pueda editar
                    />
                    <TextField
                        id="IdTipoSeccionOK"
                        label="IdTipoSeccionOK*"
                        value={formik.values.IdTipoSeccionOK}
                        {...commonTextFieldProps}
                        error={ formik.touched.IdTipoSeccionOK && Boolean(formik.errors.IdTipoSeccionOK) }
                        helperText={ formik.touched.IdTipoSeccionOK && formik.errors.IdTipoSeccionOK }
                        disabled={isDeleteMode} //Si está eliminando que el campo no se pueda editar
                    />
                    <TextField
                        id="Secuencia"
                        label="Secuencia*"
                        value={formik.values.Secuencia}
                        {...commonTextFieldProps}
                        error={ formik.touched.Secuencia && Boolean(formik.errors.Secuencia) }
                        helperText={ formik.touched.Secuencia && formik.errors.Secuencia }
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
                        onClick={() => setInfoAdShowModal(false)}
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
export default InfoAdModal;