import { Navigate, useLocation, Outlet} from "react-router-dom";
import Cookies from "js-cookie";
import { UseAuth } from "./Auth/auth";
import PropTypes from 'prop-types';

const isAuthenicated = () =>{
    const token = Cookies.get('accessToken');
    return Boolean(token);  
}




// const ProtectedRoute = () =>{

//     if(isAuthenicated()){
//         return <Outlet/>;
//     }
//     else{
//         return <Navigate to="/login" replace/>;
//     }
// }

const ProtectedRoute = () =>{

    const {isLoggedIn} = UseAuth();
    const location = useLocation();

    if(!isLoggedIn){
        return <Navigate to="/Login" replace state={{ from: location }}/>
    }
       return <Outlet />;
    
}

// ProtectedRoute.propTypes = {
//   children: PropTypes.node, // Step 2: Validate children prop
// };
export default ProtectedRoute;