import { Outlet} from "react-router-dom";
import AppBar from "../../../share/components/AppBarShippings";
export default function Home() {
    return (
      <div id='div-home'>
        {/* <h2>Home Page - Shippings Project</h2> */}
        <div id='div-appbar'>
          <AppBar />
        </div>
          <div id="detail">
              <Outlet />
          </div>
      </div>
    );
  }
