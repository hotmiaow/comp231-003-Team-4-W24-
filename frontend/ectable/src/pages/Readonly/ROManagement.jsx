import { useState, useEffect } from "react";
import Cookies from "js-cookie";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";

import { fetchReadonlyReservations } from "./api-ROManagement";

const token = Cookies.get("accessToken");
const RestManagement = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const controller = new AbortController();
  const signal = controller.signal;
  const credentials = {
    t: token,
  };

  const fetchBookings = async () => {
    const readonlyId = Cookies.get("userId");
    console.log(readonlyId);

    if (!readonlyId) return;
    const data = await fetchReadonlyReservations(
      { readonlyId: readonlyId },
      credentials,
      signal
    );
    if (data && !data.error) {
      setBookings(data);
    }
  };

  return (
    <>
      {bookings.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Reservation id</TableCell>
                <TableCell>Restaurant Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>People</TableCell>
                <TableCell>Selected Menu</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>{booking._id}</TableCell>
                  <TableCell>{booking.restaurantName}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>{booking.time}</TableCell>
                  <TableCell>{booking.people}</TableCell>
                  <TableCell>
                    {booking.menuSelection && booking.menuSelection.length > 0
                      ? booking.menuSelection.join(", ")
                      : "No menu selected"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>No bookings available</p>
      )}
    </>
  );
};

export default RestManagement;
