import { useContext } from "react";
import { currencyFormatter } from "../util/formatting";

import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import Input from "./UI/Input";
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgressContext";
import useHttp from "../hooks/useHttp";
import Errror from "./Errror";

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
  } = useHttp("http://localhost:3000/orders", requestConfig);

  const cartTotal = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  );

  function handleClose() {
    userProgressCtx.hideCheckout();
  }

  function handleSubmit(e) {
    e.preventDefault();

    const fd = new FormData(e.target);
    const customerData = Object.fromEntries(fd.entries());

    sendRequest({
      order: {
        items: cartCtx.items,
        customer: customerData,
      },
    });

    fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData,
        },
      }),
    });
  }

  let actions = (
    <>
      {" "}
      <Button type="button" textOnly onClick={handleClose}>
        close
      </Button>
      <Button>Submit Order</Button>
    </>
  );

  if (isSending) {
    actions = <span>sending order data...</span>;
  }

  if (data && !error) {
    <Modal open={userProgressCtx.progress === "checkout"} onClose={handleClose}>
      <h2>Success !</h2>
      <p>Your order was submitted successfully.</p>
      <p>
        We will get back to you with more details via email within the next few
        minutes.
      </p>
      <p className="modal-actions">
        <Button onClick={handleClose}>Okay</Button>
      </p>
    </Modal>;
  }

  return (
    <Modal open={userProgressCtx.progress === "checkout"} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>

        <Input label="Full Name" type="text" id="name" />
        <Input label="E-Mail Address" type="email" id="email" />
        <Input label="Street" type="text" id="street" />

        <div className="control-row">
          <Input label="Postal Code" type="text" id="postal-code" />
          <Input label="City" type="text" id="city" />
        </div>

        {error && <Errror title="Failed to submit order" message={error} />}

        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );
}

export default Checkout;
