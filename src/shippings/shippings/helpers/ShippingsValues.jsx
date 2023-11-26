import { ShippingsModel } from "../models/ShippingsModel";

export const ShippingValues = (values) => {
    let Shipping = ShippingsModel()
    Shipping.id_ordenOK = values.id_ordenOK,
    Shipping.id_domicilioOK = values.id_domicilioOK,
    Shipping.id_proveedorOK = values.id_proveedorOK
    return Shipping
}
