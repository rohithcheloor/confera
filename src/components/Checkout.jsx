import React, { useState } from "react";
import { Button } from "react-bootstrap";
import PayPal from "../components/Paypal";

function Checkout() {
  const [checkout, setCheckOut] = useState(false);

  return (
    <div className="checkout">
      {checkout ? (
        <PayPal />
      ) : (
        <Button
          onClick={() => {
            setCheckOut(true);
          }}
          variant="primary"
          className="mt-3"
        >
          Donate!
        </Button>
      )}
    </div>
  );
}

export default Checkout;

<Button
  onClick={() => this.handleJoinRoomWithLink()}
  variant="primary"
  className="mt-3"
>
  Join Room
</Button>;
