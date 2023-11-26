import React from "react";
import { Dialog, DialogContent, DialogTitle, Typography, TextField, DialogActions, Box, Alert } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";

//FIC: Formik - Yup
import { useFormik } from "formik";
import * as Yup from "yup";

//FEAK: Helpers
import { ShippingValues } from "../helpers/ShippingsValues";

//FEAK: Services
import { AddOneShipping } from "../services/remote/post/AddOneShipping";

const AddShippingModal = ({ AddShippingShowModal, setAddShippingShowModal, onUpdateShippingData}) => {
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
    
    //FIC: Definition Formik y Yup.
    const formik = useFormik({
        initialValues: {
            id_ordenOK: "",
            id_domicilioOK: "",
            id_proveedorOK: "",
        },
        validationSchema: Yup.object({
            id_ordenOK: Yup.string()
                .required("Campo requerido")
                .matches(/^[a-zA-Z0-9-]+$/, 'Solo se permiten caracteres alfanuméricos'),
            id_domicilioOK: Yup.string().required("Campo requerido"),
            id_proveedorOK: Yup.string().required("Campo requerido"),
        }),
        onSubmit: async (values) => {
            console.log("FIC: entro al onSubmit despues de hacer click en boton Guardar");
            //FIC: reiniciamos los estados de las alertas de exito y error.
            setMensajeErrorAlert(null);
            setMensajeExitoAlert(null);
            try {
                //FIC: si fuera necesario meterle valores compuestos o no compuestos
                //a alguns propiedades de formik por la razon que sea, se muestren o no
                //estas propiedades en la ventana modal a travez de cualquier control.
                //La forma de hacerlo seria:
                //formik.values.IdInstitutoBK = `${formik.values.IdInstitutoOK}-${formik.values.IdCEDI}`;
                //formik.values.Matriz = autoChecksSelecteds.join(",");
            
                //FIC: Extraer los datos de los campos de
                //la ventana modal que ya tiene Formik.
                const Shipping = ShippingValues(values);
                //FIC: mandamos a consola los datos extraidos
                console.log("<<Shipping>>", Shipping);
                //FIC: llamar el metodo que desencadena toda la logica
                //para ejecutar la API "AddOneShipping" y que previamente
                //construye todo el JSON de la coleccion de Shippings para
                //que pueda enviarse en el "body" de la API y determinar si
                //la inserción fue o no exitosa.
                await AddOneShipping(Shipping);
                //FIC: si no hubo error en el metodo anterior
                //entonces lanzamos la alerta de exito.
                setMensajeExitoAlert("Envío fue creado y guardado Correctamente");
                //FIC: falta actualizar el estado actual (documentos/data) para que
                //despues de insertar el nuevo envio se visualice en la tabla,
                //pero esto se hara en la siguiente nota.
                //PARA VOLVER A LLAMAR A LA FUNCIÓN PARA QUE SE MUESTRE EL NUEVO DATO GUARDADO EN LA TABLA
                onUpdateShippingData();
            } catch (e) {
                setMensajeExitoAlert(null);
                setMensajeErrorAlert("No se pudo crear el Envío");
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
            open={AddShippingShowModal}
            onClose={() => setAddShippingShowModal(false)}
            fullWidth
        >
            <form onSubmit={formik.handleSubmit}>
                {/* FIC: Aqui va el Titulo de la Modal */}
                <DialogTitle>
                    <Typography component="h6">
                        <strong>Agregar Nuevo Envio</strong>
                    </Typography>
                </DialogTitle>
                {/* FIC: Aqui va un tipo de control por cada Propiedad de Shippings */}
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column' }}
                    dividers
                >
                    {/* FIC: Campos de captura o selección */}
                    <TextField
                        id="id_ordenOK"
                        label="IdOrdenOK*"
                        value={formik.values.id_ordenOK}
                        {...commonTextFieldProps}
                        error={ formik.touched.id_ordenOK && Boolean(formik.errors.id_ordenOK) }
                        helperText={ formik.touched.id_ordenOK && formik.errors.id_ordenOK }
                    />
                    <TextField
                        id="id_domicilioOK"
                        label="IdDomicilioOK*"
                        value={formik.values.id_domicilioOK}
                        {...commonTextFieldProps}
                        error={ formik.touched.id_domicilioOK && Boolean(formik.errors.id_domicilioOK) }
                        helperText={ formik.touched.id_domicilioOK && formik.errors.id_domicilioOK }
                    />
                    <TextField
                        id="id_proveedorOK"
                        label="IdProveedorOK*"
                        value={formik.values.id_proveedorOK}
                        {...commonTextFieldProps}
                        error={ formik.touched.id_proveedorOK && Boolean(formik.errors.id_proveedorOK) }
                        helperText={ formik.touched.id_proveedorOK && formik.errors.id_proveedorOK }
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
                        onClick={() => setAddShippingShowModal(false)}
                    >
                        <span>CERRAR</span>
                    </LoadingButton>
                    {/* FIC: Boton de Guardar. */}
                    <LoadingButton
                        color="primary"
                        loadingPosition="start"
                        startIcon={<SaveIcon />}
                        variant="contained"
                        type="submit"
                        disabled={!!mensajeExitoAlert}
                    >
                        <span>GUARDAR</span>
                    </LoadingButton>
                </DialogActions>
            </form>
        </Dialog>
    );
};
export default AddShippingModal;