// frontend/ectable/src/pages/RestaurantDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";

import image1 from "../../assets/images/image1.jpg";
import image2 from "../../assets/images/image2.jpg";
import image3 from "../../assets/images/image3.jpg";
import image4 from "../../assets/images/image4.jpg";
import image5 from "../../assets/images/image5.jpg";
import image6 from "../../assets/images/image6.jpg";

// Assuming you have an API service to fetch restaurant details
import { list } from "./api-restaurant";

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
    padding: "20px",
  },
  card: {
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease-in-out",
    cursor: "pointer",
  },
  cardHover: {
    transform: "scale(1.05)",
  },
  content: {
    padding: "20px",
  },
  link: {
    textDecoration: "none",
    color: "#0077cc",
  },
};

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    list().then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setRestaurants(data);
      }
    });
  }, []);

  const imageMap = {
    "image1.jpg": image1,
    "image2.jpg": image2,
    "image3.jpg": image3,
    "image4.jpg": image4,
    "image5.jpg": image5,
    "image6.jpg": image6,
    // Add more mappings as needed
  };

  if (error) return <div>Error: {error}</div>;
  if (!restaurants || restaurants.length === 0) return <div>Loading...</div>;
  return (
    <div style={styles.container}>
      {restaurants.map((restaurant) => (
        <div
          key={restaurant._id}
          style={styles.card}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <div style={styles.content}>
            {/*
            <img src={restaurant.photo} alt={restaurant.name} />
      */}
            <img
              src={imageMap[restaurant.selectedImage]}
              alt={restaurant.name}
            />
            <h3>Name : {restaurant.name}</h3>
            <p>Location : {restaurant.location}</p>
            <p>Rating : {restaurant.rating}</p>
            <p>Price : {restaurant.price}</p>
            <p>Open Hr : {restaurant.opening}</p>
            <p>Close Hr : {restaurant.closing}</p>
            <p>Phone : {restaurant.phone}</p>
            <p>Description : {restaurant.description}</p>

            {/* Link to the restaurant detail page */}
            <Link to={`../BookingPage/${restaurant._id}`} style={styles.link}>
              Book Now
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RestaurantList;
