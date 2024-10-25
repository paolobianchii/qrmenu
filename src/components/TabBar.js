import React from "react";
import { NavLink } from "react-router-dom";
import { MenuOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import { useCart } from "./CartContext";
import "./TabBar.css";

const TabBar = () => {
  const { getTotalQuantity, totalPrice } = useCart();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="tab-bar">
      <NavLink
        exact="true"
        to="/qrmenu"
        activeClassName="active"
        className="tab-link"
        onClick={scrollToTop} 
      >
        <MenuOutlined className="icon" />
        <span style={{ marginLeft: 10 }}>Menu</span>
      </NavLink>
      <NavLink
        to="/carrello"
        activeClassName="active"
        className="tab-link"
      >
        <ShoppingCartOutlined className="icon" style={{ fontSize: 18 }} />
        <span style={{ marginLeft: 10 }}></span>
        <Badge
          count={getTotalQuantity()}
          offset={[0, -0]}
          className="badgeCart"
        />
        <Badge
          count={`${totalPrice} €`}
          offset={[10, 0]}
          style={{ color: "#fff", fontSize: 12, fontWeight: "600", backgroundColor: "transparent" }}
        />
      </NavLink>
    </nav>
  );
};

export default TabBar;
