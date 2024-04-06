const create = async (Reservation) => {
  try {
    console.log(JSON.stringify(Reservation));
    let response = await fetch("https://ectable.onrender.com/api/Reservation/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Reservation),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const read = async (params, credentials, signal) => {
  try {
    let response = await fetch(
      "https://ectable.onrender.com/api/Reservation/" + params.id,
      {
        method: "GET",
        signal: signal,
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
const update = async (params, credentials, user) => {
  try {
    let response = await fetch("https://ectable.onrender.com/api/Reservation/" + params.userId, {
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
    let response = await fetch("https://ectable.onrender.com/api/Reservation/" + params.userId, {
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
const find = async (params, credentials, signal) => {
  try {
    let response = await fetch("https://ectable.onrender.com/api/Reservation/find", {
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
const readUserId = async (params, credentials, signal) => {
  try {
    let response = await fetch(
      "https://ectable.onrender.com/api/Reservation/User/" + params.userId,
      {
        method: "GET",
        signal: signal,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
        credentials: "include",
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
const fetchReservations = async (params, credentials, signal) => {
  try {
    let response = await fetch(
      `https://ectable.onrender.com/api/Reservation/Admin/${params.userId}`,
      {
        method: "GET",
        signal: signal,
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

export { create, fetchReservations, read, update, remove, find, readUserId };
