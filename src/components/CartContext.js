import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]); // Assicurati che sia un array vuoto

    const addToCart = (item, quantity) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((i) => i.id === item.id);
            if (existingItem) {
                return prevItems.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
                );
            }
            return [...prevItems, { ...item, quantity }];
        });
    };

    const getTotalQuantity = () => {
        // Assicurati che cartItems sia un array
        if (!Array.isArray(cartItems)) {
            console.error("cartItems non è un array:", cartItems);
            return 0; // Restituisci 0 se non è un array
        }
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, getTotalQuantity }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
