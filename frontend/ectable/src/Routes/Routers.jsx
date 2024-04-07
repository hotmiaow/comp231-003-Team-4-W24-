import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
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
import {useLocationContext} from "../components/Location/locationTrack"
import MyRestaurants from "../pages/Restaurants/MyRestaurants";

import { Routes, Route } from "react-router-dom";
const Routers = () => {
  
  const location = useLocation();
  console.log(location.pathname)

  const {setLocations} = useLocationContext();

  useEffect(() =>{
    if(location.pathname !== '/Login'){
      Cookies.set('prevPath', location.pathname,{ expires: 1/12 } );
      setLocations(location.pathname);
    }
  },[location.pathname, setLocations])
  
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
        <Route path="/MyRestaurants/:userId" element={<MyRestaurants />} />
        <Route path="/Restaurant/availability/:restaurantid" element={<Availability/>} />
      </Route>
    </Routes>
  );
};

export default Routers;
