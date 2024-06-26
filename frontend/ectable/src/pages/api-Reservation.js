import axios from "axios";
const create = async (Reservation) => {
  try {
    console.log(JSON.stringify(Reservation));
    let response = await fetch("http://localhost:5500/Reservation/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Reservation),
    });

    console.log(`response :  ${response}`);
    console.log(response)
    if (response.ok) {
      // Parse the JSON response if the request was successful
      const data = await response.json();
      return { success: true, data };
    } else {
      // If the server responded with an error status, parse the JSON error message
      const error = await response.json();
      return { success: false, error: error.message || "An unknown error occurred" };
    }
  } catch (err) {
    // Log and return the error if the request failed to send
    console.log(err);
    return { success: false, error: err.message || "An error occurred while making the request" };
  }
};
const list = async (signal) => {
  try {
    let response = await fetch("/Reservation/", {
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
    let response = await fetch(
      "http://localhost:5500/Reservation/" + params.id,
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
    let response = await axios.put(`http://localhost:5500/Reservation/${params.userId}/update`, user, {
      
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${credentials.t}`,
      },
    });
    
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const remove = async (params, credentials) => {
  
    axios.delete(`http://localhost:5500/Reservation/${params.userId}/delete`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    }).then(()=>{
      console.log("deleted by frontend")
    }).catch((err)=>{
      console.error(err)
    })
};


const find = async (params, credentials, signal) => {
  try {
    let response = await fetch("http://localhost:5500/Reservation/find", {
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
      "http://localhost:5500/Reservation/User/" + params.userId,
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

export { create, list, read, update, remove, find, readUserId };
