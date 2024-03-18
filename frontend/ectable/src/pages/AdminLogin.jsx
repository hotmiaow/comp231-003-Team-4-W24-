import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { authLogin } from "../components/Auth/auth";
import { useLocation } from "react-router-dom";
// import { useParams } from "react-router-dom";
import Cookies from "js-cookie";


const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const navigate = useNavigate();
  const location = useLocation();
 
  var url = "/";

  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    const userID = Cookies.get("userId"); // Use the correct cookie name here
    console.log(`UserID from cookie: ${userID}`);
    setIsLoggedIn(!!userID)
  }, []);

    async function handleSubmit(event) {
    event.preventDefault();
    console.log(from);
    await authLogin(email, password, url);
    
    const type = Cookies.get("type");
    console.log(type);
    const adminId = Cookies.get("userId");
    console.log(adminId);

      if (type === "Admin") {
        setIsLoggedIn(true);
        url = `/admin/${adminId}`; // Redirect to Booking Page with restaurantId
        console.log(url);
        window.location.href = url;
      } else {
      // url = "/"; // Or redirect to another default page
      // console.log(url);
        setIsLoggedIn(false);
        alert("Login failed")
      
      }
    }
    
    
  

  const { from } = location.state || { from: { pathname: "/" } };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-lg max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Administrator Sign In
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
    </div>
  );
};

export default AdminLogin;