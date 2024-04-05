import Home from "../pages/Home";
import Services from "../pages/Services";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Contact from "../pages/Contact";
import Admin from "../pages/Admin/Admin";
import RestManagement from "../pages/Admin/RestManagement";
import RestaurantSignup from "../pages/Admin/RestaurantSignup";
import RestaurantList from "../pages/Restaurants/RestaurantList";
import ProtectedRoute from "../components/ProtectedRoutes";
import BookingPage from "../pages/BookingPage";
import BookingManagement from "../pages/Restaurants/BookingManagement";
import ROManagement from "../pages/Readonly/ROManagement";
import Menu from "../pages/Restaurants/Menu";
import Availability from "../pages/Restaurants/Availability";
// import { UseAuth } from "../components/Auth/auth";

import { Routes, Route } from "react-router-dom";
const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/Services" element={<Services />} />
      <Route path="/Contact" element={<Contact />} />
      <Route path="/BookingPage" element={<BookingPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/Admin/:userId" element={<Admin />} />
        <Route path="/RestManagement/:userId" element={<RestManagement />} />
        <Route path="/RestaurantSignup/:userId" element={<RestaurantSignup />} />
        <Route path="/BookingPage/:restaurantId" element={<BookingPage />} />
        <Route path="/RestaurantList" element={<RestaurantList />} />
        <Route path="/Menu/Restaurant/:restaurantId" element={<Menu />} />
        <Route path="/BookingManagement/:userId" element={<BookingManagement />} />
        <Route path="/ROManagement/:userId" element={<ROManagement />} />
        <Route path="/Restaurant/availability/:restaurantid" element={<Availability/>} />
      </Route>
    </Routes>
  );
};

export default Routers;
