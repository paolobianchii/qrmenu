// src/components/TabBar.js
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { MenuOutlined, ShoppingCartOutlined } from "@ant-design/icons"; // Importa le icone
import "./TabBar.css";
import { Badge } from "antd";
import { useCart } from "./CartContext";

const TabBar = () => {
  const [showCartLink /*setShowCartLink*/] = useState(false); // Stato per controllare la visibilità
  const { getTotalQuantity } = useCart(); // Recupera la funzione per ottenere il totale

  return (
    <nav className="tab-bar">
      <NavLink exact to="/" activeClassName="active" className="tab-link">
        <MenuOutlined className="icon" /> {/* Icona del menu */}
        <span>Menu</span>
      </NavLink>
      <NavLink to="/carrello" activeClassName="active" className="tab-link">
        <ShoppingCartOutlined className="icon" /> {/* Icona per Carrello */}
        <Badge count={getTotalQuantity()} offset={[10, 0]}>
          Carrello
        </Badge>
      </NavLink>
      {showCartLink && ( // Condizione per mostrare il NavLink
        <NavLink to="/pagamento" activeClassName="active" className="tab-link">
          <ShoppingCartOutlined className="icon" />
          <span>Pagamento</span>
        </NavLink>
      )}
    </nav>
  );
};

export default TabBar;
