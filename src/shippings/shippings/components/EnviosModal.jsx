import React from "react";
import { Dialog, DialogContent, DialogTitle, Typography, TextField, DialogActions, Box, Alert,
         FormControlLabel, Checkbox, InputLabel, Select, MenuItem, FormHelperText, Autocomplete } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { useState, useEffect } from "react";

//FIC: Formik - Yup
import { useFormik } from "formik";
import * as Yup from "yup";

//HELPERS
import { EnviosValues } from "../helpers/EnviosValues";

//SERVICES
import { AddOneEnvio } from "../services/remote/post/AddOneEnvio";
import { UpdateOneEnvio } from "../services/remote/put/UpdateOneEnvio";
import { DeleteOneEnvio } from "../services/remote/del/DeleteOneEnvio";
import { GetAllLabels } from "../services/remote/get/GetAllLabels";
import { GetAllPersonas } from "../services/remote/get/GetAllPersonas";

//FEAK: UUID (Objeto ID Universal)
import { v4 as genID } from "uuid";

const EnviosModal = ({ EnviosShowModal, setEnviosShowModal, selectedShippingData, reloadTable, isEditMode, isDeleteMode, row }) => {
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
    const [EtiquetaValuesLabel, setEtiquetaValuesLabel] = useState([]);
    const [Etiqueta2ValuesLabel, setEtiqueta2ValuesLabel] = useState([]);
    const [EnvioValuesLabel, setEnvioValuesLabel] = useState([]);
    const [Envio2ValuesLabel, setEnvio2ValuesLabel] = useState([]);
    const [DomicilioOptions, setDomicilioOptions] = useState([]);

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
            const LabelsTypes = Labels.find(
                (label) => label.IdEtiquetaOK === "IdCatPaqueteria"
            );
            setEtiquetaValuesLabel(LabelsTypes.valores);
            setEtiqueta2ValuesLabel(LabelsTypes);
            const LabelsEnvios = Labels.find(
                (label) => label.IdEtiquetaOK === "IdTipoMetodoEnvio"
            );
            setEnvioValuesLabel(LabelsEnvios.valores);
            setEnvio2ValuesLabel(LabelsEnvios);
            // const Personas = await GetAllPersonas();
            // const DomicilioTypes = Personas.map(persona => persona.cat_personas_domicilios).flat();
            // setDomicilioValues(DomicilioTypes);
            console.log("DATOS DE ETIQUETAS", Labels);
        } catch (e) {
            console.error("Error al obtener Etiquetas para Tipos Metodo envio de info_ad:", e);
        }
    }

    useEffect(() => {
        async function getDataSelectDomicilio() {
            try {
                const Personas = await GetAllPersonas();
                const DomicilioTypes = Personas.map(persona => persona.cat_personas_domicilios).flat();
                console.log("DATOS DE DOMICILIO AAAAAAAAA", DomicilioTypes);
                setDomicilioOptions(DomicilioTypes);
                console.log("DATOS DE DOMICILIOS", DomicilioOptions);
            } catch (e) {
                console.error("Error al obtener Domicilios:", e);
            }
        }

        getDataSelectDomicilio();
    }, []);

    //Para ver la data que trae el documento completo desde el dispatch de ShippingsTable
    console.log("DATA YA PASADA EN EnviosMODAL AAAAAAA",selectedShippingData); 
    console.log("MODO DE BORRAR ES:",isDeleteMode);
    console.log("MODO DE ACTUALIZAR ES:",isEditMode);

    const [IdGen, setIdGen] = useState(genID().replace(/-/g, "").substring(0, 8));

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
                    
                    EnvioSubdocument.info_ad = row.info_ad;
                    EnvioSubdocument.productos = row.productos;
                    EnvioSubdocument.estatus = row.estatus;
                    EnvioSubdocument.rastreos = row.rastreos;
                    // console.log("DATOS AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", selectedShippingData.envios);

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
                    const concat = Etiqueta2ValuesLabel.IdEtiquetaOK;
                    const idpaqueteria = `${concat}-${values.IdPaqueteriaOK}`;
                    const concat2 = Envio2ValuesLabel.IdEtiquetaOK;
                    const idenvio = `${concat2}-${values.IdTipoMetodoEnvio}`;
                    
                    //Poner el Id del documento existente para pasar al servicio POST
                    const existingShippingId = selectedShippingData.IdEntregaOK;
                    const instituto = selectedShippingData.IdInstitutoOK;
                    const negocio = selectedShippingData.IdNegocioOK;
    
                    //Pasar los parametros al servicio de POST del archivo AddOneInfoAd.jsx
                    //En el mismo orden se pasa: Id del documento existente || Los valores que el usuario pone en el form y que se sacan
                    //de formik || El objeto con los valores predefinidos (IdEtiquetaOK, IdEtiqueta, Etiqueta,...etc...)
                    console.log("INFO DE DETAIL_ROW", EnvioSubdocument);
                    await AddOneEnvio(existingShippingId, instituto, negocio, {...EnvioSubdocument, IdPaqueteriaOK: idpaqueteria, IdTipoMetodoEnvio: idenvio});
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
                    {/* <TextField
                        id="IdDomicilioOK"
                        label="IdDomicilioOK*"
                        value={formik.values.IdDomicilioOK}
                        {...commonTextFieldProps}
                        error={ formik.touched.IdDomicilioOK && Boolean(formik.errors.IdDomicilioOK) }
                        helperText={ formik.touched.IdDomicilioOK && formik.errors.IdDomicilioOK }
                        disabled={false} //Si está eliminando que el campo no se pueda editar
                    /> */}
                    <Autocomplete
                        id="IdDomicilioOK"
                        options={DomicilioOptions}
                        disabled={isEditMode || isDeleteMode}
                        getOptionLabel={(option) => option.CalleNumero}
                        value={DomicilioOptions.find(option => option.IdDomicilioOK === formik.values.IdDomicilioOK) || null}
                        onChange={(event, newValue) => {
                            formik.setFieldValue("IdDomicilioOK", newValue ? newValue.IdDomicilioOK : "");
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="IdDomicilioOK*"
                                {...commonTextFieldProps}
                                error={formik.touched.IdDomicilioOK && Boolean(formik.errors.IdDomicilioOK)}
                                helperText={formik.touched.IdDomicilioOK && formik.errors.IdDomicilioOK}
                                disabled={false} // Puedes ajustar esto según tus necesidades
                            />
                        )}
                    />
                    {/* <TextField
                        id="IdPaqueteriaOK"
                        label="IdPaqueteriaOK*"
                        value={formik.values.IdPaqueteriaOK}
                        {...commonTextFieldProps}
                        error={ formik.touched.IdPaqueteriaOK && Boolean(formik.errors.IdPaqueteriaOK) }
                        helperText={ formik.touched.IdPaqueteriaOK && formik.errors.IdPaqueteriaOK }
                        disabled={isDeleteMode} //Si está eliminando que el campo no se pueda editar
                    /> */}
                    <Autocomplete
                        id="IdPaqueteriaOK"
                        options={EtiquetaValuesLabel}
                        disabled={isDeleteMode}
                        getOptionLabel={(option) => option.Valor}
                        value={{ Valor: formik.values.IdPaqueteriaOK }}
                        onChange={(event, newValue) => formik.setFieldValue("IdPaqueteriaOK", newValue ? newValue.Valor : "")}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="IdPaqueteriaOK*"
                                {...commonTextFieldProps}
                                error={formik.touched.IdPaqueteriaOK && Boolean(formik.errors.IdPaqueteriaOK)}
                                helperText={formik.touched.IdPaqueteriaOK && formik.errors.IdPaqueteriaOK}
                                disabled={isDeleteMode}
                            />
                        )}
                    />
                    {/* <TextField
                        id="IdTipoMetodoEnvio"
                        label="IdTipoMetodoEnvio*"
                        value={formik.values.IdTipoMetodoEnvio}
                        {...commonTextFieldProps}
                        error={ formik.touched.IdTipoMetodoEnvio && Boolean(formik.errors.IdTipoMetodoEnvio) }
                        helperText={ formik.touched.IdTipoMetodoEnvio && formik.errors.IdTipoMetodoEnvio }
                        disabled={isDeleteMode} //Si está eliminando que el campo no se pueda editar
                    /> */}
                    <Autocomplete
                        id="IdTipoMetodoEnvio"
                        options={EnvioValuesLabel}
                        disabled={isDeleteMode}
                        getOptionLabel={(option) => option.Valor} //Poner para que se muestre el campo valor
                        value={{ Valor: formik.values.IdTipoMetodoEnvio }}
                        onChange={(event, newValue) => {
                            console.log("DATOS DE NEWVALUE", newValue);
                            formik.setFieldValue("IdTipoMetodoEnvio", newValue ? newValue.IdValorOK : "");
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Selecciona una etiqueta"
                                {...commonTextFieldProps}
                                error={formik.touched.IdTipoMetodoEnvio && Boolean(formik.errors.IdTipoMetodoEnvio)}
                                helperText={formik.touched.IdTipoMetodoEnvio && formik.errors.IdTipoMetodoEnvio}
                                disabled={isDeleteMode}
                            />
                        )}
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