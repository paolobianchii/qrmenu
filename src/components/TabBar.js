import React from "react";
import { NavLink } from "react-router-dom";
import { MenuOutlined, ShoppingCartOutlined } from "@ant-design/icons"; // Importa le icone
import "./TabBar.css";
import { Badge } from "antd";
import { useCart } from "./CartContext";

const TabBar = ({ activeTab }) => {
  const { getTotalQuantity } = useCart(); // Recupera la funzione per ottenere il totale

  return (
    <nav className="tab-bar">
      <NavLink
        exact
        to="/qrmenu"
        activeClassName="active"
        className={`tab-link ${activeTab === "about" ? "active" : ""}`}
      >
        <MenuOutlined className="icon" /> {/* Icona del menu */}
        <span>Menu</span>
      </NavLink>
      <NavLink
        to="/carrello"
        activeClassName="active"
        className={`tab-link ${activeTab === "about" ? "active" : ""}`}
      >
        <ShoppingCartOutlined className="icon" /> {/* Icona per Carrello */}
        <span>Carrello</span>
        <Badge
          count={getTotalQuantity()}
          offset={[20, -46]}
          className="badgeCart"
        ></Badge>
      </NavLink>
    </nav>
  );
};

export default TabBar;
