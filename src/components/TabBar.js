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
        <span style={{marginLeft:10}}>Menu</span>
      </NavLink>
      <NavLink
        to="/carrello"
        activeClassName="active"
        className={`tab-link ${activeTab === "carrello" ? "active" : ""}`}
      >
        <ShoppingCartOutlined className="icon" style={{fontSize:18}}/> {/* Icona per Carrello */}
        <span style={{marginLeft:10}}></span>
        <Badge
          count={getTotalQuantity()} // Mostra il numero totale di articoli nel carrello
          offset={[0, -0]} // Regola la posizione del Badge
          className="badgeCart"
        />
        <Badge
          count={`${totalPrice} €`}  // Mostra il prezzo totale nel badge
          offset={[10, 0]} // Regola la posizione del Badge
          style={{color:"#fff", fontSize:12, fontWeight:"600", backgroundColor:"transparent"}}
        />
      </NavLink>
    </nav>
  );
};

export default TabBar;
