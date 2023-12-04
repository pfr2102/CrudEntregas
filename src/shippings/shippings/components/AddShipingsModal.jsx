import React from "react";
import { Dialog, DialogContent, DialogTitle, Typography, TextField, DialogActions, Box, Alert } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { useState, useEffect } from "react";

//FIC: Formik - Yup
import { useFormik } from "formik";
import * as Yup from "yup";

//FEAK: Helpers
import { ShippingValues } from "../helpers/ShippingsValues";

//FEAK: Services
import { AddOneShipping } from "../services/remote/post/AddOneShipping";
import { UpdateOneShipping } from "../services/remote/put/UpdateOneShipping";
import { DeleteOneShipping } from "../services/remote/del/DeleteOneShipping"; 

//FEAK: UUID (Objeto ID Universal)
import { v4 as genID } from "uuid";

const AddShippingModal = ({ AddShippingShowModal, setAddShippingShowModal, onUpdateShippingData, isEditMode, isDeleteMode, row }) => {
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");

    //Para principal (12 caracteres)
    const [IdGen, setIdGen] = useState(genID().replace(/-/g, "").substring(0, 12));

    console.log("MODO DE BORRAR ES:",isDeleteMode);
    console.log("MODO DE ACTUALIZAR ES:",isEditMode);
    
    //FIC: Definition Formik y Yup.
    const formik = useFormik({
        initialValues: {
            IdEntregaOK: row ? row.IdEntregaOK : `9001-${IdGen}`, 
            IdEntregaBK: row ? row.IdEntregaBK : "", // Operador ternario para determinar si usa los datos de "row" si están disponibles
            IdOrdenOK: row ? row.IdOrdenOK : "",
        },
        validationSchema: Yup.object({
            IdEntregaOK: Yup.string()
                .required("Campo requerido")
                .matches(/^[a-zA-Z0-9-]+$/, 'Solo se permiten caracteres alfanuméricos'),
            IdEntregaBK: Yup.string().required("Campo requerido"),
            IdOrdenOK: Yup.string().required("Campo requerido"),
        }),
        onSubmit: async (values) => {
            console.log("FIC: entro al onSubmit despues de hacer click en boton Guardar");
            //FIC: reiniciamos los estados de las alertas de exito y error.
            setMensajeErrorAlert(null);
            setMensajeExitoAlert(null);
            try {
                // console.log("ENTRÓ AL TRY!!!");
                // console.log(isEditMode);
                //Si la modal esta en modo de edición (osease en actualizar, PUT pues) pues se ejecuta la primera condición que es para
                //actualizar
                if(isEditMode) {
                    console.log("SE ESTA ACTUALIZANDO RAAAAAAAAAH");
                    const Shipping = ShippingValues(values);
                    console.log("<<Shipping>>", Shipping);
                    // console.log("LA ID QUE SE PASA COMO PARAMETRO ES:", row._id);
                    // Utiliza la función de actualización si estamos en modo de edición
                    await UpdateOneShipping(Shipping, row ? row.IdEntregaOK : null); //se puede sacar el objectid con row._id para lo del fic aaaaaaaaaaaaaaaaaaa
                    setMensajeExitoAlert("Envío actualizado Correctamente");
                    onUpdateShippingData(); //usar la función para volver a cargar los datos de la tabla y que se vea la actualizada
                }else if(isDeleteMode){
                    const Shipping = ShippingValues(values);
                    console.log("<<Shipping>>", Shipping);
                    // console.log("LA ID QUE SE PASA COMO PARAMETRO ES:", row._id);
                    // Utiliza la función de eliminar si estamos en modo de eliminación
                    await DeleteOneShipping(row.IdEntregaOK);
                    setMensajeExitoAlert("Envío eliminado Correctamente");
                    onUpdateShippingData(); //usar la función para volver a cargar los datos de la tabla y que se vea la actualizada
                }else{
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
                }
            } catch (e) {
                setMensajeExitoAlert(null);
                setMensajeErrorAlert(isEditMode ? "No se pudo actualizar el envío" : 
                                     isDeleteMode ? "No se pudo eliminar el envío" : 
                                     "No se pudo guardar el envío"); //operador ternario para mostrar mensaje de error correspondiente
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

    //useEffect para si estamos actualizando el campo no se pueda editar, se usa dentro del mismo textfield
    // Dentro del componente AddShippingModal
    useEffect(() => {
        // Si estamos en modo edición, deshabilita el campo
        if (isEditMode) {
        formik.setFieldValue("id_ordenOK", formik.values.IdEntregaOK); // Asegúrate de establecer el valor
        formik.setFieldTouched("id_ordenOK", false); // También puedes desactivar el indicador de "touched" si lo deseas
        }
    }, [isEditMode]);
  
    
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
                        <strong>{isEditMode ? "ACTUALIZAR ENVÍO" : isDeleteMode ? "ELIMINAR ENVÍO" : "AGREGAR ENVÍO"}</strong>
                    </Typography>
                </DialogTitle>
                {/* FIC: Aqui va un tipo de control por cada Propiedad de Shippings */}
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column' }}
                    dividers
                >
                    {/* FIC: Campos de captura o selección */}
                    <TextField
                        id="IdEntregaOK"
                        label="IdEntregaOK*"
                        value={formik.values.IdEntregaOK}
                        {...commonTextFieldProps}
                        error={ formik.touched.IdEntregaOK && Boolean(formik.errors.IdEntregaOK) }
                        helperText={ formik.touched.IdEntregaOK && formik.errors.IdEntregaOK }
                        disabled={true} //Linea para establecer si se esta actualizando O eliminando que 
                                                              //el campo no se pueda editar.
                    />
                    <TextField
                        id="IdEntregaBK"
                        label="IdEntregaBK*"
                        value={formik.values.IdEntregaBK}
                        {...commonTextFieldProps}
                        error={ formik.touched.IdEntregaBK && Boolean(formik.errors.IdEntregaBK) }
                        helperText={ formik.touched.IdEntregaBK && formik.errors.IdEntregaBK }
                        disabled={isDeleteMode} //Si está eliminando que el campo no se pueda editar
                    />
                    <TextField
                        id="IdOrdenOK"
                        label="IdOrdenOK*"
                        value={formik.values.IdOrdenOK}
                        {...commonTextFieldProps}
                        error={ formik.touched.IdOrdenOK && Boolean(formik.errors.IdOrdenOK) }
                        helperText={ formik.touched.IdOrdenOK && formik.errors.IdOrdenOK }
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
                        onClick={() => setAddShippingShowModal(false)}
                    >
                        <span>CERRAR</span>
                    </LoadingButton>
                    {/* FIC: Boton de Guardar o actualizar segun el modo. */}
                    <LoadingButton
                        style={{ backgroundColor: isDeleteMode ? "#ff0000" : "" }} //Para poner el color del boton en rojo solo si se está ELIMINANDO
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
export default AddShippingModal;
