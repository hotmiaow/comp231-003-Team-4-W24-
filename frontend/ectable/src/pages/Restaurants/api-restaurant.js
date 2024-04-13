const create = async (Restaurant) => {
  try {
    console.log(JSON.stringify(Restaurant));
    let response = await fetch("https://ectable.onrender.com/api/restaurants/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Restaurant),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const list = async (signal) => {
  try {
    let response = await fetch("https://ectable.onrender.com/api/restaurants/", {
      method: "GET",
      signal: signal,
      credentials: 'include'
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
const read = async (params, credentials, signal) => {
  try {
    console.log(credentials.t);
    console.log(params._id);
    let response = await fetch(
      `https://ectable.onrender.com/api/restaurants/${params._id}`,
      {
        method: "GET",
        signal: signal,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t
        },
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
const update = async (params, credentials, user) => {
  try {
    let response = await fetch(
      "https://ectable.onrender.com/api/restaurants/" + params.userId,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
        body: JSON.stringify(user),
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
const remove = async (params, credentials) => {
  try {
    let response = await fetch(
      "https://ectable.onrender.com/api/restaurants/" + params.userId,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const fetchMyRestaurants = async (credentials, signal) => {
  try {
    let response = await fetch("https://ectable.onrender.com/api/MyRestaurants/", {
      method: "GET",
      signal: signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: credentials.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export { create, list, read, update, remove, fetchMyRestaurants};
