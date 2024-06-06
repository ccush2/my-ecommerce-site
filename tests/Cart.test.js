import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import Cart from "../src/components/Cart";
import "@testing-library/jest-dom";

jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Cart component", () => {
  beforeEach(() => {
    localStorage.setItem("authToken", "mockToken");
    axios.get.mockClear();
    axios.put.mockClear();
    axios.delete.mockClear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  test("displays error message when fetching cart items fails", async () => {
    const errorMessage = "Error fetching cart items. Please try again later.";
    axios.get.mockRejectedValue(new Error("Network Error"));

    render(
      <MemoryRouter>
        <Cart updateCartItemCount={() => {}} />
      </MemoryRouter>
    );

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  test("renders empty cart message when no items are in the cart", async () => {
    axios.get.mockResolvedValue({ data: [] });

    await act(async () => {
      render(
        <MemoryRouter>
          <Cart updateCartItemCount={() => {}} />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("Your cart is empty.")).toBeInTheDocument();
    expect(screen.getByText("Continue Shopping")).toBeInTheDocument();
  });

  test("renders cart items and proceeds to checkout when the button is clicked", async () => {
    const cartItems = [
      {
        productId: 1,
        title: "Product 1",
        price: 10,
        quantity: 2,
        image: "product1.jpg",
      },
      {
        productId: 2,
        title: "Product 2",
        price: 20,
        quantity: 1,
        image: "product2.jpg",
      },
    ];
    axios.get.mockResolvedValue({ data: cartItems });

    const navigate = jest.fn();
    jest
      .spyOn(require("react-router-dom"), "useNavigate")
      .mockImplementation(() => navigate);

    await act(async () => {
      render(
        <MemoryRouter>
          <Cart updateCartItemCount={() => {}} />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeInTheDocument();
      expect(screen.getByText("Product 2")).toBeInTheDocument();
    });

    const proceedToCheckoutButton = screen.getByText("Proceed to Checkout");
    fireEvent.click(proceedToCheckoutButton);

    expect(navigate).toHaveBeenCalledWith("/checkout");
  });

  test("updates the quantity of a cart item", async () => {
    const initialCartItems = [
      {
        productId: 1,
        title: "Product 1",
        price: 10,
        quantity: 2,
        image: "product1.jpg",
      },
    ];
    const updatedCartItems = [
      {
        productId: 1,
        title: "Product 1",
        price: 10,
        quantity: 3,
        image: "product1.jpg",
      },
    ];

    axios.get.mockResolvedValueOnce({ data: initialCartItems });
    axios.put.mockResolvedValueOnce({ data: updatedCartItems });

    await act(async () => {
      render(
        <MemoryRouter>
          <Cart updateCartItemCount={() => {}} />
        </MemoryRouter>
      );
    });

    const increaseQuantityButton = screen.getByRole("button", { name: "+" });
    await act(async () => {
      fireEvent.click(increaseQuantityButton);
    });

    expect(axios.put).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  test("removes a cart item", async () => {
    const initialCartItems = [
      {
        productId: 1,
        title: "Product 1",
        price: 10,
        quantity: 2,
        image: "product1.jpg",
      },
      {
        productId: 2,
        title: "Product 2",
        price: 20,
        quantity: 1,
        image: "product2.jpg",
      },
    ];
    const updatedCartItems = [
      {
        productId: 2,
        title: "Product 2",
        price: 20,
        quantity: 1,
        image: "product2.jpg",
      },
    ];

    axios.get.mockResolvedValueOnce({ data: initialCartItems });
    axios.delete.mockResolvedValueOnce({ data: {} });
    axios.get.mockResolvedValueOnce({ data: updatedCartItems });

    await act(async () => {
      render(
        <MemoryRouter>
          <Cart updateCartItemCount={() => {}} />
        </MemoryRouter>
      );
    });

    const removeButtons = screen.getAllByRole("button", { name: "Remove" });
    await act(async () => {
      fireEvent.click(removeButtons[0]);
    });

    expect(axios.delete).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByText("Product 1")).not.toBeInTheDocument();
      expect(screen.getByText("Product 2")).toBeInTheDocument();
    });
  });

  test("clears the entire cart", async () => {
    const initialCartItems = [
      {
        productId: 1,
        title: "Product 1",
        price: 10,
        quantity: 2,
        image: "product1.jpg",
      },
      {
        productId: 2,
        title: "Product 2",
        price: 20,
        quantity: 1,
        image: "product2.jpg",
      },
    ];
    const emptyCart = [];

    axios.get.mockResolvedValueOnce({ data: initialCartItems });
    axios.delete.mockResolvedValueOnce({ status: 204 });
    axios.get.mockResolvedValueOnce({ data: emptyCart });

    const updateCartItemCountMock = jest.fn();

    await act(async () => {
      render(
        <MemoryRouter>
          <Cart updateCartItemCount={updateCartItemCountMock} />
        </MemoryRouter>
      );
    });

    const clearCartButton = screen.getByText("Clear Cart");

    await act(async () => {
      fireEvent.click(clearCartButton);
    });

    expect(axios.delete).toHaveBeenCalledTimes(1);
    expect(axios.delete).toHaveBeenCalledWith(
      "https://users-server-2wv1.onrender.com/api/cart",
      {
        headers: { Authorization: `Bearer mockToken` },
      }
    );

    await waitFor(() => {
      expect(screen.getByText("Your cart is empty.")).toBeInTheDocument();
    });

    expect(updateCartItemCountMock).toHaveBeenCalledTimes(1);
  });
});
