const create = async (Restaurant) => {
  try {
    console.log(JSON.stringify(Restaurant));
    let response = await fetch("http://localhost:5500/Restaurants/register", {
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
    let response = await fetch("/Restaurants/", {
      method: "GET",

      signal: signal,
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
const read = async (params, credentials, signal) => {
  try {
    let response = await fetch("/Restaurants/" + params.RestaurantId, {
      method: "GET",
      signal: signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
const update = async (params, credentials, user) => {
  try {
    let response = await fetch("/Restaurants/" + params.RestaurantId, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify(user),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
const remove = async (params, credentials) => {
  try {
    let response = await fetch("/Restaurants/" + params.RestaurantId, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
export { create, list, read, update, remove };
