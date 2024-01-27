import { MouseEvent } from "react";

function ListGroup() {
  const items = ["New york", "San francisco", "tokyo", "london"];

  const handleEvent = (event: MouseEvent) => console.log(event);
  //items = [];
  return (
    <>
      <h1>List</h1>
      {items.length === 0 && <p>There are no items</p>}
      <ul className="list-group">
        {items.map((item) => (
          <li
            className="list-group-item active"
            key={item}
            onClick={handleEvent}
          >
            {" "}
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
