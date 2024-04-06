import logo from "../../assets/images/logo.png";
import { NavLink, Link } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { UseAuth } from "../Auth/auth";

const NavLinks = [
  {
    path: "/home",
    display: "Home",
  },
  {
    path: "/RestaurantList",
    display: "Restaurants",
  },
  {
    path: "/Signup",
    display: "Signup",
  },
];

const Header = () => {
  const navigate = useNavigate();
  const {isLoggedIn, userType, userIDs,restIDs, authLogout} = UseAuth();
  console.log(restIDs);

  const logout = () => {
    authLogout();
    console.log("Logged out!");
    navigate("/login");
  };

  return (
    <header className="header flex items-center">
      <div className="container flex items-center justify-between w-full">
        
        <div>
          <img src={logo} alt="logo" />
        </div>

        <div className="navigation">
          <ul className="menu flex items-center gap-[2.7rem]">
            {NavLinks.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={(isActive) =>
                    isActive
                      ? "text-primary-Color text-[16px] leading-7 font-[600]"
                      : "text-text-Color text-[16px] leading-7 font-[500] hover:text-primary-Color"
                  }
                >
                  {item.display}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden">
            <Link to="/">
              <figure className="w-[35px] h-[35px] rounded-full cursor-pointer">
                <img
                  src="{userImg}"
                  alt="user"
                  className="w-full h-full rounded-full"
                />
              </figure>
            </Link>
          </div>

          {!isLoggedIn && (
            <Link to="/login">
              <button className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center-justify-center rounded-[50px]">
                Login
              </button>
            </Link>
          )}
          <div className="container flex items-center justify-between w-full">

            <div className="flex-grow" />
            <div className="flex gap-x-4">
                {isLoggedIn && (
                <button
                  onClick={logout}
                  className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center-justify-center rounded-[50px]"
                >
                  Logout
                </button>
                )}

              {(userType === "Admin" || userType === "chef") && (
                <button
                  onClick={() => navigate(`/Menu/Restaurant/${restIDs}`)}
                  className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center-justify-center rounded-[50px]"
                >
                  Menu Management
                </button>
              )}

              {userType === "Admin" && (
                <button
                  onClick={() => navigate(`/Admin/${userIDs}`)}
                  className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center-justify-center rounded-[50px]"
                >
                  Admin Page
                </button>
              )}

              {userType === "Diner" && (
                <button
                  onClick={() => navigate(`/BookingManagement/${userIDs}`)}
                  className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center-justify-center rounded-[50px]"
                >
                  Booking Management
                </button>
              )}
              {userType === "Readonly" && (
                <button
                  onClick={() => navigate(`/ROManagement${userIDs}`)}
                  className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center-justify-center rounded-[50px]"
                >
                  View Booking
                </button>
              )}

            </div>
          
          </div>
          <span className="md:hidden">
            <BiMenu className="w-6 h-6 cursor-pointer" />
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
