
import Navbar from "../../organisms/navbar";
import { Outlet } from "react-router-dom";
import Footer from "../../organisms/footer";


const CustomerLayout: React.FC = () => {
    return (
        <div>
            <Navbar />
            <Outlet />
            <Footer/>
        </div>
    );
};

export default CustomerLayout;
