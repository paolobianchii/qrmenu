// TabBar.jsx
import React from "react";
import { NavLink, useLocation } from "react-router-dom";  // Aggiungiamo useLocation
import { MenuOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import { useCart } from "./CartContext";
import "./TabBar.css";

const TabBar = () => {
  const { getTotalQuantity, totalPrice } = useCart();
  const location = useLocation();  // Otteniamo la location corrente

  // Controlliamo se siamo nella root dell'app o nel percorso /qrmenu
  const isMenuActive = location.pathname === '/' || location.pathname === '/qrmenu';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="tab-bar">
      <NavLink
        exact="true"
        to="/qrmenu"
        className={`tab-link ${isMenuActive ? 'menu-tab' : ''}`}
        onClick={scrollToTop}
      >
        <MenuOutlined className="icon" />
        <span style={{ marginLeft: 10 }}>Menu</span>
      </NavLink>
      <NavLink
        to="/carrello"
        className="tab-link"
      >
        <ShoppingCartOutlined className="icon" style={{ fontSize: 18 }} />
        <span style={{ marginLeft: 10 }}></span>
        <Badge
          count={getTotalQuantity()}
          offset={[0, -0]}
          showZero={true}
          className="badgeCart"
        />
        <Badge
          count={`${totalPrice} €`}
          offset={[10, 0]}
          style={{ color: "#000000", marginLeft:-5,fontSize: 14, fontWeight: "600", backgroundColor: "transparent" }}
        />
      </NavLink>
    </nav>
  );
};

export default TabBar;