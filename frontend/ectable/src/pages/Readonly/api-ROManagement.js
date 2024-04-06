const fetchReadonlyReservations = async (params, credentials, signal) => {
  try {
    let response = await fetch(
      `https://ectable.onrender.com:5500/Reservation/readonly/${params.readonlyId}`,
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

export { fetchReadonlyReservations };
