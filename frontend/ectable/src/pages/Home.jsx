import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import icon01 from "../assets/images/icon01.png";
import icon02 from "../assets/images/icon02.png";
import icon03 from "../assets/images/icon03.png";
import About from "../components/About/About";
import RestaurantList from "./Restaurants/RestaurantList";

const Home = () => {
  return (
    <>
      <div className="mt-[30px] mx-5">
        {/* RestaurantList Section - Full Width */}
        {/*
          <section className="mb-5">
            <RestaurantList />
          </section>
        */}

        {/* Grid for other content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 lg:gap-[30px]">
          {/* Book Table in ECTable Section */}

          {/* Register your Restaurants Section */}
          <div className="grid grid-cols-2 gap-5 lg:gap-[30px]">
            {/* The two divs you want to be horizontal */}
            <div className="py-[30px]">
              {/* First div content */}
              <div className="flex items-center justify-center">
                <img src={icon03} alt="" width="60" height="60" />
              </div>
              <div className="mt-[30px]">
                <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">
                  Login and browse listed Restaurants
                </h2>
                <p className="text-[16px] leading-7 text-textColor font-[400] text-center mt-4">
                  Start with ECTable and get more customers
                </p>
                <Link
                  to="/RestaurantList"
                  className="w-[44px] h-[44px] rounded-full border border-solid mt-auto flex items-center justify-center bg-blue-500 hover:bg-blue-600"
                >
                  <BsArrowRight className="text-white w-6 h-5" />
                </Link>
              </div>
            </div>
            <div className="py-[30px]">
              {/* Second div content */}
              <div className="mt-[30px]">
                <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">
                  Register a account to book a table or create your Restaurants
                </h2>
                <p className="text-[16px] leading-7 text-textColor font-[400] text-center mt-4">
                  Start with ECTable and get more customers
                </p>
                <Link
                  to="/Signup"
                  className="w-[44px] h-[44px] rounded-full border border-solid mt-auto flex items-center justify-center bg-blue-500 hover:bg-blue-600"
                >
                  <BsArrowRight className="text-white w-6 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <section>
          <About />
        </section>
      </div>
    </>
  );
};

export default Home;
