import { createBrowserRouter } from "react-router-dom";
import Home from "../shippings/home/pages/Home";
import Prices from "../shippings/prices/pages/Prices";
import Shippings from "../shippings/shippings/pages/shippings";
import Payments from "../shippings/payments/pages/Payments";
import Orders from "../shippings/orders/pages/Orders";
import Error from "../share/errors/pages/Error";


const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <Error />,
      children: [
        {
          path: "/shippings",
          element: <Shippings />,
        },
        {
          path: "/prices",
          element: <Prices />,
        },
        {
          path: "/orders",
          element: <Orders />,
        },
        {
            path: "/payments",
            element: <Payments />,
        },
      ],
    },
  ]);
  export default router;
