import React, { useState } from "react";
import PayPal from "../components/Paypal";

function Checkout() {
  const [checkout, setCheckOut] = useState(false);

  return (
    <div className="checkout">
      {checkout ? (
        <PayPal />
      ) : (
        <button
          onClick={() => {
            setCheckOut(true);
          }}
        >
          Donate!
        </button>
      )}
    </div>
  );
}

export default Checkout;
