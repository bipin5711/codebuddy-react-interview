import { useState, useEffect } from "react";
import "./SeatReservation.css";

function SeatReservation() {
  const [row, setRow] = useState("3");
  const [seatList, setSeatList] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  const fetchSeat = () => {
    fetch(`https://codebuddy.review/seats?count=${row}`)
      .then((res) => res.json())
      .then((data) => setSeatList(data.data));
  };

  const handleRowChange = (e) => {
    let { value } = e.target;
    if (value >= 1 && value <= 10) {
      setRow(e.target.value);
    }
  };
  const calculateTotalCost = () => {
    let cost = selectedSeats.reduce((acc, cur) => {
      return acc + (cur.row + 1) * 10 + 20;
    }, 0);

    setTotalCost(cost);
  };
  const handleSelectSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      let filterSeats = selectedSeats.filter((item) => item.id != seat.id);
      setSelectedSeats(filterSeats);
    } else {
      if (selectedSeats.length >= 5) {
        window.alert("You cannot select more than 5 seats");
      } else {
        setSelectedSeats([...selectedSeats, seat]);
      }
    }
  };

  const bookTicket = () => {
    if (selectedSeats.length == 0) {
      window.alert("Please select minimum 1 seat");
      return;
    }
    const selectedSeatsList = selectedSeats.map((item) => item.id);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selectedSeats: selectedSeatsList }),
    };
    fetch("https://codebuddy.review/submit", requestOptions)
      .then((response) => response.json())
      .then((data) => window.alert("Seat booked successfully"));
  };

  useEffect(() => {
    fetchSeat();
  }, []);

  useEffect(() => {
    calculateTotalCost();
  }, [selectedSeats]);
  
  return (
    <div className="container">
      <input value={row} type="text" onChange={handleRowChange} />
      <button onClick={fetchSeat} className="button">
        Submit
      </button>
      <button onClick={bookTicket} className="button">
        Book Ticket
      </button>
      <p> Total Cost is {totalCost}</p>
      {seatList.map((item) => (
        <div className="row-container" key={item.id}>
          {item.seats.map((seat) => (
            <div
              className={`inverted-pyramid ${
                seat.isReserved
                  ? "reserved-seat"
                  : selectedSeats.includes(seat)
                    ? "selected-seat"
                    : "seat"
              }`}
              key={seat.id}
              onClick={() => !seat.isReserved && handleSelectSeat(seat)}
            >
              <p>Seat: {seat.seatNumber}</p>
              <p>{seat.isReserved ? "Reserved" : "Not Reserved"} </p>
              <p>Row: {seat.row + 1}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default SeatReservation;
