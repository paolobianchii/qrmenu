import React from "react";
import { Route, Routes } from "react-router-dom";
import Carrello from "./pages/Carrello";
import Menu from "./pages/Menu";
import Pagamento from "./pages/Pagamento";
import TabBar from "./components/TabBar";
import "./App.css";
import { CartProvider } from "./components/CartContext";

// Definizione del Layout
const Layout = ({ children }) => (
  <div className="layout-container">
    <div className="content">{children}</div>
    <TabBar /> {/* La TabBar viene visualizzata su tutte le pagine */}
  </div>
);

function App() {
  return (
    <CartProvider>
      <Routes>
        {/* Usa Layout per avvolgere le tue pagine */}
        <Route
          exact
          path="/"
          element={
            <Layout>
              <Menu />
            </Layout>
          }
        />
        <Route
          path="/qrmenu"
          element={
            <Layout>
              <Menu />
            </Layout>
          }
        />
        <Route
          path="/carrello"
          element={
            <Layout>
              <Carrello />
            </Layout>
          }
        />
        <Route
          path="/pagamento"
          element={
            <Layout>
              <Pagamento />
            </Layout>
          }
        />
      </Routes>
    </CartProvider>
  );
}

export default App;
