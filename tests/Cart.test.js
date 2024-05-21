import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import Cart from "../src/components/Cart";
import "@testing-library/jest-dom";

jest.mock("axios");

describe("Cart component", () => {
  beforeEach(() => {
    localStorage.setItem("authToken", "mockToken");
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

  test("renders cart items when items are in the cart", async () => {
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
  });
});
