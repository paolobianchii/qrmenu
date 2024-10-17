import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      // Incrementa la quantità se l'item è già nel carrello
      setCartItems(cartItems.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + item.quantity } // Aggiorna la quantità con quella passata
          : cartItem
      ));
    } else {
      // Aggiungi un nuovo elemento al carrello
      setCartItems([...cartItems, { ...item, quantity: item.quantity }]);
    }
  };
  const getTotalProducts = () => {
    return cartItems.length; // Conta il numero di prodotti unici nel carrello
  };
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const getTotalQuantity = () => totalQuantity; // Aggiungi questa funzione

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2); // Calcola il totale e formatta a 2 decimali

  return (
    <CartContext.Provider value={{ cartItems, totalQuantity, getTotalProducts, getTotalQuantity, totalPrice, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
