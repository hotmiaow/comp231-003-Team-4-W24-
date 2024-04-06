import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import icon03 from "../assets/images/icon03.png";
import About from "../components/About/About";

const Home = () => {
  return (
    <>
      <div className="mt-[30px] mx-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 lg:gap-[30px]">

          <div className="grid grid-cols-2 gap-5 lg:gap-[30px]">

            <div className="py-[30px]">

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
        <section>
          <About />
        </section>
      </div>
    </>
  );
};

export default Home;
