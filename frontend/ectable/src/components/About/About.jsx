import React from "react";
import aboutImg from "../../assets/images/aboutImg.jpg";
//import aboutCardImg from "../../assets/images/aboutCardImg.png";

const About = () => {
  return (
    <section>
      <div className="container">
        <div className="flex justify-between gap-[50px] lg:gap-[130px] xl:gap-0 flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 xl:w-[670px] order-1 lg-order-2">
            <h2 className="text-[36px] leading-[48px] text-headingColor font-[700] mb-[30px]">
              About ECTable
            </h2>
            <p className="text-[18px] leading-[30px] text-text-Color font-[400] mb-[30px]">
              ECTable is a web application that allows users to find and book
              tables in restaurants. It also allows users to see comments for
              over 100 restaurants in town.
            </p>
          </div>

          <div className="relative w-3/4 lg:w-1/2 xl:w-[770px] z-10 order-2 lg:order-1">
            <img src={aboutImg} alt="aboutImg" />
          </div>

          {/*==== about content --*/}
        </div>
      </div>
    </section>
  );
};

export default About;
