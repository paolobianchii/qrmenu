import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Carica i dati dal localStorage al caricamento della pagina
  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  // Salva i dati del carrello nel localStorage ogni volta che `cartItems` cambia
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    const existingItemIndex = cartItems.findIndex((i) => i.id === item.id);
  
  if (existingItemIndex > -1) {
    // Se esiste già, aggiorna la quantità
    const updatedItems = [...cartItems];
    updatedItems[existingItemIndex].quantity += item.quantity; // Aggiungi alla quantità esistente
    setCartItems(updatedItems);
  } else {
    // Se non esiste, aggiungi nuovo elemento
    setCartItems([...cartItems, item]);
  }
  };

  const updateQuantity = (id, quantityChange) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + quantityChange } // Aggiorna la quantità
          : item
      )
    );
  };

  const getTotalProducts = () => cartItems.length;

  const removeFromCart = (mealId) => {
  setCartItems((prevItems) => prevItems.filter((item) => item.id !== mealId));
};
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const getTotalQuantity = () => totalQuantity;

  const totalPrice = cartItems
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalQuantity,
        clearCart,
        getTotalProducts,
        getTotalQuantity,
        totalPrice,
        addToCart,
        updateQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
