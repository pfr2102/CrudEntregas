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
import { EnvInfoAdValues } from "../helpers/EnvInfoAdValues";

//SERVICES
import { AddOneEnvInfoAd } from "../services/remote/post/AddOneEnvInfoAd";
import { UpdateOneEnvInfoAd } from "../services/remote/put/UpdateOneEnvInfoAd";
import { DeleteOneEnvInfoAd } from "../services/remote/del/DeleteOneEnvInfoAd";
import { GetAllLabels } from "../services/remote/get/GetAllLabels";

const EnvInfoAdModal = ({ EnvInfoAdShowModal, setEnvInfoAdShowModal, selectedEnvioData, selectedShippingData, 
                          reloadTable, isEditMode, isDeleteMode, row }) => {
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
    const [ValorValuesLabel, setValorValuesLabel] = useState([]);
    const [EtiquetaValuesLabel, setEtiquetaValuesLabel] = useState([]);

    //FIC: en cuanto se abre la modal llama el metodo
    //que ejecuta la API que trae todas las etiquetas de la BD.
    useEffect(() => {
        getDataSelectEtiquetaType();
    }, []);

    //FIC: Ejecutamos la API que obtiene todas las etiquetas
    //y filtramos solo la etiqueta de TipoMetodoEnvio de cat_etiquetas
    //para que los ID y Nombres se agreguen como items en el
    //control <Select> del campo IdEtiquetaOK en la Modal.
    async function getDataSelectEtiquetaType() {
        try {
            const Labels = await GetAllLabels();
            const ValoresTypes = Labels.find(
                (label) => label.IdEtiquetaOK === "IdTipoMetodoEnvio"
            );
            setValorValuesLabel(ValoresTypes.valores);
            setEtiquetaValuesLabel(Labels);
        } catch (e) {
            console.error("Error al obtener Etiquetas para Tipos Metodo envio de info_ad:", e);
        }
    }

    console.log("DATA YA PASADA EN EnvINFOADMODAL AAAAAAA",selectedEnvioData); 
    console.log("MODO DE BORRAR ES:",isDeleteMode);
    console.log("MODO DE ACTUALIZAR ES:",isEditMode);

    //FIC: Definition Formik y Yup
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
                    const InfoAd = EnvInfoAdValues(values);
                    // Obtener el ID del subdocumento que se está editando
                    const subdocumentId = row.IdEtiquetaOK;
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
                    //Poner el objeto de InfoAd = InfoAdValues o sino no genera el detail_row_reg.
                    await UpdateOneEnvInfoAd(InfoAd, idInstituto, idNegocio, existingShippingId, idDomicilio, subdocumentId);
                    
                    reloadTable();
                    setMensajeExitoAlert("Info Adicional actualizada correctamente");
                }else if(isDeleteMode){
                    console.log("SE ESTÁ BORRANDO RAAAAAAAAAH");
                    // Obtener el ID del subdocumento que se está editando
                    const subdocumentId = row.IdEtiquetaOK;
                    //Poner el Id del documento existente para pasar al servicio DELETE
                    const existingShippingId = selectedShippingData.IdEntregaOK;
                    const idInstituto = selectedShippingData.IdInstitutoOK;
                    const idNegocio = selectedShippingData.IdNegocioOK;
                    const idDomicilio = selectedEnvioData.IdDomicilioOK;

                    await DeleteOneEnvInfoAd(idInstituto, idNegocio, existingShippingId, idDomicilio, subdocumentId);
                    reloadTable();
                    setMensajeExitoAlert("Info Adicional eliminada correctamente");
                }else{
                    //Usar InfoAdValues para obtener los valores definidos del subdocumento en el archivo del mismo nombre
                    const infoAdSubdocument = EnvInfoAdValues(values);
                    
                    //Poner el Id del documento existente para pasar al servicio POST
                    const existingShippingId = selectedShippingData.IdEntregaOK;
                    const instituto = selectedShippingData.IdInstitutoOK;
                    const negocio = selectedShippingData.IdNegocioOK;
                    const domicilio = selectedEnvioData.IdDomicilioOK;
    
                    //Pasar los parametros al servicio de POST del archivo AddOneInfoAd.jsx
                    //En el mismo orden se pasa: Id del documento existente || Los valores que el usuario pone en el form y que se sacan
                    //de formik || El objeto con los valores predefinidos (IdEtiquetaOK, IdEtiqueta, Etiqueta,...etc...)
                    // console.log("INFO DE DETAIL_ROW", infoAdSubdocument);
                    await AddOneEnvInfoAd(existingShippingId, instituto, negocio, domicilio, infoAdSubdocument);
                    reloadTable();
                    setMensajeExitoAlert("Info Adicional creada y guardada Correctamente");
                }
            } catch (e) {
                setMensajeExitoAlert(null);
                console.error("<<ERROR>> en onSubmit:", e);
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
            open={EnvInfoAdShowModal}
            onClose={() => setEnvInfoAdShowModal(false)}
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
                    {/* <TextField
                        id="IdEtiquetaOK"
                        label="IdEtiquetaOK*"
                        value={formik.values.IdEtiquetaOK}
                        {...commonTextFieldProps}
                        error={ formik.touched.IdEtiquetaOK && Boolean(formik.errors.IdEtiquetaOK) }
                        helperText={ formik.touched.IdEtiquetaOK && formik.errors.IdEtiquetaOK }
                        disabled={isDeleteMode} //Si está eliminando que el campo no se pueda editar
                    /> */}
                    <Select
                        value={formik.values.IdEtiquetaOK}
                        label="Selecciona una opción"
                        onChange={(event) => {
                            const selectedId = event.target.value;
                            const selectedOption = EtiquetaValuesLabel.find((tipoEtiqu) => tipoEtiqu.IdEtiquetaOK === selectedId);

                            formik.setValues({
                                ...formik.values,
                                IdEtiquetaOK: selectedId,
                                Etiqueta: selectedOption?.Etiqueta || "", //Los de la derecha son los nombres en 
                                Secuencia: selectedOption?.Secuencia || "", //la bd/modelo del otro equipo, NO los nuestros
                                IdTipoSeccionOK: selectedOption?.Seccion || "",
                            });
                        }}
                        name="IdEtiquetaOK"
                        onBlur={formik.handleBlur}
                        disabled={!!mensajeExitoAlert}
                    >
                        {EtiquetaValuesLabel.map((tipoEtiqu) => (
                            <MenuItem
                                value={`${tipoEtiqu.IdEtiquetaOK}`}
                                key={tipoEtiqu.IdEtiquetaOK}
                            >
                                {tipoEtiqu.IdEtiquetaOK}
                            </MenuItem>
                        ))}
                    </Select>
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
                    {/* <TextField
                        id="Valor"
                        label="Valor*"
                        value={formik.values.Valor}
                        {...commonTextFieldProps}
                        error={ formik.touched.Valor && Boolean(formik.errors.Valor) }
                        helperText={ formik.touched.Valor && formik.errors.Valor }
                        disabled={isDeleteMode} //Si está eliminando que el campo no se pueda editar
                    /> */}
                    <Select
                        value={formik.values.Valor}
                        label="Selecciona una opción"
                        onChange={formik.handleChange}
                        name="Valor" //FIC: Asegúrate que coincida con el nombre del campo
                        onBlur={formik.handleBlur}
                        disabled={!!mensajeExitoAlert}
                    >
                        {ValorValuesLabel.map((tipoEtiq) => {
                            return (
                            <MenuItem
                                value={`${tipoEtiq.Valor}`}
                                key={tipoEtiq.Valor}
                            >
                                {tipoEtiq.Valor}
                            </MenuItem>
                            );
                        })}
                    </Select>
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
                        onClick={() => setEnvInfoAdShowModal(false)}
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
export default EnvInfoAdModal;