import React from "react";
import { Dialog, DialogContent, DialogTitle, Typography, TextField, DialogActions } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";

//FIC: Formik - Yup
import { useFormik } from "formik";
import * as Yup from "yup";

const AddShippingModal = ({ AddShippingShowModal, setAddShippingShowModal}) => {
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
                .matches(/^[a-zA-Z0-9-]+$/, 'Solo se permiten caracteres alfanuméricos y el simbolo "-"'),
            id_domicilioOK: Yup.string().required("Campo requerido"),
            id_proveedorOK: Yup.string().required("Campo requerido"),
        }),
        onSubmit: async (values) => {

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
            <form>
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
                        //onClick={() => setAddInstituteShowModal(false)}
                    >
                        <span>GUARDAR</span>
                    </LoadingButton>
                </DialogActions>
            </form>
        </Dialog>
    );
};
export default AddShippingModal;