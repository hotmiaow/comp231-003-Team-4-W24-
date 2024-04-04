import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
// import { authLogin } from "../components/Auth/auth";
// import { useLocation } from "react-router-dom";
// import { useParams } from "react-router-dom";
import { UseAuth } from "../components/Auth/auth";
// import { LocationContext } from "react-router/dist/lib/context";
// import Cookies from "js-cookie";
// import { Typography } from "@material-ui/core";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@material-ui/core";

const Login = () => {
  const {authLogin} = UseAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [FailDialog, setFailDialog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const par = useParams();
  const { restaurantId } = par;
  var url = "/";
  const from = location.state?.from?.pathname || "/";
  console.log(`location : ${{location}}`);
  console.log(from)
  console.log(`location state : ${location.state}`);

  console.log(authLogin)

  const handleClose = () =>{
    setFailDialog(false)
  }

  async function handleSubmit(event) {
    console.log({ restaurantId });
    event.preventDefault();
    console.log(from);
    if (from) {
      url = from; // Redirect to Booking Page with restaurantId
      console.log(url);
    } else {
      url = "/"; // Or redirect to another default page
      console.log(url);
    }
      try{
        console.log(email)
        console.log(password)
        console.log(url)
        const logins = await authLogin(email, password, url);

        console.log(logins);
            if(logins) {
                navigate(url)
            }else{
              console.error('login failed')
              setFailDialog(true);
              
            }
      }catch(error){
        console.error('redirect error, ' + error)
      }
    
  }

  // const { from } = location.state || { from: { pathname: "/" } };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-lg max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Sign In
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-500 font-medium rounded-md text-sm shadow-sm hover:shadow-lg transition-colors duration-200"
          >
            Sign In
          </button>
        </form>
      </div>
        <Dialog open={FailDialog} onClose={handleClose}>
          <DialogTitle>Login Failed</DialogTitle>
          <DialogContent>
            Please try again with correct email and password.
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              OK
            </Button>
          </DialogActions>
          </Dialog>
    </div>
  );
};

export default Login;
