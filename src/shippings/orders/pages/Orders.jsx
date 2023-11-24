import { Outlet} from "react-router-dom";
export default function Orders() {
    return (
      <div id='div-home'>
        <h2>Orders Page - Shippings Project</h2>
        <div id="detail">
            <Outlet />
        </div>
      </div> 
    );
  }
