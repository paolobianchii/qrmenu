import React from "react";
import { NavLink } from "react-router-dom";
import { MenuOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import { useCart } from "./CartContext";
import "./TabBar.css";

const TabBar = ({ activeTab }) => {
  const { getTotalQuantity, totalPrice,getTotalProducts } = useCart(); // Recupera la funzione per ottenere il totale degli articoli

  return (
    <nav className="tab-bar">
      <NavLink
        exact
        to="/qrmenu"
        activeClassName="active"
        className={`tab-link ${activeTab === "menu" ? "active" : ""}`}
      >
        <MenuOutlined className="icon" /> {/* Icona del menu */}
        <span>Menu</span>
      </NavLink>
      <NavLink
        to="/carrello"
        activeClassName="active"
        className={`tab-link ${activeTab === "carrello" ? "active" : ""}`}
      >
        <ShoppingCartOutlined className="icon" /> {/* Icona per Carrello */}
        <span>Carrello</span>
        <Badge
          count={getTotalQuantity()} // Mostra il numero totale di articoli nel carrello
          offset={[20, -40]} // Regola la posizione del Badge
          className="badgeCart"
        />
        <Badge
          count={`${totalPrice} €`}  // Mostra il prezzo totale nel badge
          offset={[2, 2]} // Regola la posizione del Badge
          style={{color:"#fff", fontSize:12, fontWeight:"600", backgroundColor:"transparent"}}
        />
      </NavLink>
    </nav>
  );
};

export default TabBar;
