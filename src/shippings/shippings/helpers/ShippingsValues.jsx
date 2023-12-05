import { ShippingsModel } from "../models/ShippingsModel";

export const ShippingValues = (values) => {
    let Shipping = ShippingsModel()
    Shipping.IdInstitutoOK = values.IdInstitutoOK,
    Shipping.IdNegocioOK = values.IdNegocioOK,
    Shipping.IdEntregaOK = values.IdEntregaOK,
    Shipping.IdEntregaBK = values.IdEntregaBK,
    Shipping.IdOrdenOK = values.IdOrdenOK
    return Shipping
}
