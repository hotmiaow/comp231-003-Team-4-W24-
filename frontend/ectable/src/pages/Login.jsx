import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authLogin } from "../components/Auth/auth";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const par = useParams();
  const { restaurantId } = par;
  var url = "/";

  async function handleSubmit(event) {
    console.log({ restaurantId });
    event.preventDefault();
    console.log(from);
    if (from === "RestaurantList") {
      url = `/BookingPage/${restaurantId}`; // Redirect to Booking Page with restaurantId
      console.log(url);
    } else {
      url = "/"; // Or redirect to another default page
      console.log(url);
    }
    await authLogin(email, password, url);
  }

  const { from } = location.state || { from: { pathname: "/" } };

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
    </div>
  );
};

export default Login;
