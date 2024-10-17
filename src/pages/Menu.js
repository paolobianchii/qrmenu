import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Typography, Spin, Radio, Select } from "antd";
import { useCart } from "../components/CartContext";
import { FaCoffee, FaLeaf, FaFire, FaDrumstickBite } from "react-icons/fa";

const { Title } = Typography;
const { Option } = Select;

const QuantitySelector = ({ mealId, onChange }) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    setQuantity(quantity + 1);
    onChange(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      onChange(quantity - 1);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
      <Button onClick={handleDecrement} style={{ flex: "1" }}> - </Button>
      <span style={{ margin: "0 10px" }}>{quantity}</span>
      <Button onClick={handleIncrement} style={{ flex: "1" }}> + </Button>
    </div>
  );
};

const Menu = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [language, setLanguage] = useState("it");
  const { addToCart } = useCart();

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") || "it";
    setLanguage(storedLanguage);
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
        const data = await response.json();
        if (data.meals) {
          setMeals(data.meals);
          setFilteredMeals(data.meals);
        }
      } catch (error) {
        console.error("Error fetching meals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  const filterMeals = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredMeals(meals);
    } else {
      const filtered = meals.filter((meal) => meal.strCategory === category);
      setFilteredMeals(filtered);
    }
  };

  const translate = (key) => {
    const translations = {
      it: {
        menu: "Menu",
        filter: "Filtra per categoria",
        all: "Tutti",
        vegetarian: "Vegetariani",
        beef: "Carne",
        chicken: "Pollo",
        addToCart: "Aggiungi al carrello",
        noMealsFound: "Nessun pasto trovato.",
      },
      en: {
        menu: "Menu",
        filter: "Filter by category",
        all: "All",
        vegetarian: "Vegetarian",
        beef: "Beef",
        chicken: "Chicken",
        addToCart: "Add to cart",
        noMealsFound: "No meals found.",
      },
    };
    return translations[language][key];
  };

  const handleLanguageChange = (value) => {
    setLanguage(value);
    localStorage.setItem("language", value);
  };

  return (
    <div style={{ padding: "10px" }}>
      <div
        className="sticky-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={2}>{translate("menu")}</Title>

        <Select
          value={language}
          onChange={handleLanguageChange}
          style={{ width: 120, marginLeft: "auto" }}
        >
          <Option value="it">Italiano</Option>
          <Option value="en">English</Option>
        </Select>
      </div>

      <p style={{ marginLeft: 20 }}>
        {translate("filter")} : <strong>{selectedCategory}</strong>
      </p>
      <div
        className="filter-container"
        style={{
          overflowX: "auto",
          whiteSpace: "nowrap",
          padding: "10px",
          backgroundColor: "transparent",
          borderRadius: "8px",
        }}
      >
        <Radio.Group
          value={selectedCategory}
          onChange={(e) => filterMeals(e.target.value)}
          style={{ display: "flex", justifyContent: "flex-start" }}
        >
          <Radio.Button value="All" style={{ margin: "0 10px" }}>
            <FaCoffee /> {translate("all")}
          </Radio.Button>
          <Radio.Button value="Vegetarian" style={{ margin: "0 10px" }}>
            <FaLeaf /> {translate("vegetarian")}
          </Radio.Button>
          <Radio.Button value="Beef" style={{ margin: "0 10px" }}>
            <FaFire /> {translate("beef")}
          </Radio.Button>
          <Radio.Button value="Chicken" style={{ margin: "0 10px" }}>
            <FaDrumstickBite /> {translate("chicken")}
          </Radio.Button>
        </Radio.Group>
      </div>

      {loading ? (
        <Spin size="large" style={{ margin: "20px auto", display: "block" }} />
      ) : meals.length > 0 ? (
        <Row gutter={[16, 16]}>
          {filteredMeals.map((meal) => {
            const price = 10; // Sostituisci con il prezzo desiderato o un calcolo da un API
            return (
              <Col xs={24} sm={24} md={12} key={meal.idMeal}>
                <Card
                  title={meal.strMeal}
                  bordered={true}
                  style={{ marginBottom: "20px" }}
                >
                  <img
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "10px",
                    }}
                  />
                  <QuantitySelector
                    mealId={meal.idMeal}
                    onChange={(quantity) => {
                      meal.quantity = quantity; // Aggiorna la quantità direttamente sull'oggetto pasto
                    }}
                  />
                  <Button
                    type="primary"
                    onClick={() => addToCart({ 
                      id: meal.idMeal, 
                      title: meal.strMeal, 
                      image: meal.strMealThumb, 
                      price: price,  // Aggiungi il prezzo qui
                      quantity: 1 // La quantità predefinita
                    })}
                    style={{ width: "100%" }}
                  >
                    {translate("addToCart")}
                  </Button>
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : (
        <p>{translate("noMealsFound")}</p>
      )}
    </div>
  );
};

export default Menu;
