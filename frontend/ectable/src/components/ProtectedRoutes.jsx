import { Navigate, Outlet} from "react-router-dom";
import Cookies from "js-cookie";

const isAuthenicated = () =>{
    const token = Cookies.get('accessToken');
    return Boolean(token);  
}


const ProtectedRoute = () =>{

    if(isAuthenicated()){
        return <Outlet/>;
    }
    else{
        return <Navigate to="/login" replace/>;
    }
}

export default ProtectedRoute;