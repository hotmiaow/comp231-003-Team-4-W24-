import { Navigate, useLocation, Outlet} from "react-router-dom";
import { UseAuth } from "./Auth/auth";

const ProtectedRoute = () =>{

    const {isLoggedIn} = UseAuth();
    const location = useLocation();

    if(!isLoggedIn){
        return <Navigate to="/Login" replace state={{ from: location }}/>
    }
       return <Outlet />;
    
}

export default ProtectedRoute;