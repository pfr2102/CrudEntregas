import { ShippingsModel } from "../models/ShippingsModel";

export const ShippingValues = (values) => {
    let Shipping = ShippingsModel()
    Shipping.IdEntregaOK = values.IdEntregaOK,
    Shipping.IdEntregaBK = values.IdEntregaBK,
    Shipping.IdOrdenOK = values.IdOrdenOK
    return Shipping
}
