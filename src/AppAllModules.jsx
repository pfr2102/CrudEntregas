import { RouterProvider } from "react-router-dom";
// import  EducationRouter from "./navigation/NaviRoutesEducation";
// import  EcommerceRouter from "./navigation/NaviRoutesCommerce";
import  ShippingsRouter from "./navigation/NaviRoutesShipping";
import Footer from "./share/footer/components/Footer";
import { GET_DATA_START } from "./shippings/redux/thunks";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
// import { fetchData } from "./security/redux/thunks";

export default function AppAllModules() {
    //FIC: objeto para heredar clase de dispath de redux.
    const dispatch = useDispatch();
    //FIC: para que solo entre la primera vez a cargar la data.
    useEffect(() => {
        dispatch(GET_DATA_START()).then(() => {
        //setLoading(false);
            console.log("<<END-DISPATCH>>: GET_DATA_START se ejecuto de forma correcta");
        });
    }, []);

    return (
        <>
            <div id='div-app'>
                {/* <h1>Main App - All Modules</h1> */}
                <RouterProvider router={ShippingsRouter} />
                <div id='div-footer'>
                    <Footer />
                </div>
            </div>
        </>
    );
}
