import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Typography, Spin, Radio, Select } from "antd";
import { useCart } from "../components/CartContext";
import {
  FaCoffee,
  FaLeaf,
  FaFire,
  FaDrumstickBite,
  FaPepperHot,
  FaAdjust,
} from "react-icons/fa";
import { FlagFilled } from "@ant-design/icons";

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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
        justifyContent: "flex-end",
      }}
    >
      <Button
        onClick={handleDecrement}
        style={{
          fontSize: 25,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        -
      </Button>
      <span style={{ margin: "0 10px", fontSize: 20, fontWeight: "600" }}>
        {quantity}
      </span>
      <Button
        onClick={handleIncrement}
        style={{
          fontSize: 25,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        +
      </Button>
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

  // Stato per memorizzare la quantità selezionata per ogni pasto
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") || "it";
    setLanguage(storedLanguage);
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://www.themealdb.com/api/json/v1/1/search.php?s="
        );
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

  const handleQuantityChange = (mealId, quantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [mealId]: quantity,
    }));
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
    <div>
      <div
        className="sticky-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Title level={2}>{translate("menu")}</Title>
        <Select
          value={language}
          onChange={handleLanguageChange}
          style={{ width: 120, marginLeft: "auto", marginTop: 12 }}
        >
          <Option value="it">
            <FlagFilled /> Italiano
          </Option>
          <Option value="en">
            <FlagFilled /> English
          </Option>
        </Select>
      </div>

      <div
        className="filter-container"
        style={{
          overflowX: "auto",
          whiteSpace: "nowrap",
          padding: "5px",
          backgroundColor: "transparent",
          borderRadius: "8px",
          marginTop: 15,
        }}
      >
        <Radio.Group
          value={selectedCategory}
          onChange={(e) => filterMeals(e.target.value)}
          style={{ display: "flex", justifyContent: "flex-start" }}
        >
          <Radio.Button
            value="All"
            style={{
              margin: "0 10px",
              padding: 18,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              backgroundColor: "#053EEF",
              color: "#fff",
            }}
          >
            <FaCoffee /> {translate("all")}
          </Radio.Button>
          <Radio.Button
            value="Vegetarian"
            style={{
              margin: "0 10px",
              padding: 18,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              backgroundColor: "#5BA525",
              color: "#fff",
            }}
          >
            <FaLeaf /> {translate("vegetarian")}
          </Radio.Button>
          <Radio.Button
            value="Beef"
            style={{
              margin: "0 10px",
              padding: 18,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              backgroundColor: "#AA3C3B",
              color: "#fff",
            }}
          >
            <FaFire /> {translate("beef")}
          </Radio.Button>
          <Radio.Button
            value="Chicken"
            style={{
              margin: "0 10px",
              padding: 18,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              backgroundColor: "#ECA237",
              color: "#fff",
            }}
          >
            <FaDrumstickBite /> {translate("chicken")}
          </Radio.Button>
        </Radio.Group>
      </div>

      {loading ? (
        <Spin size="large" style={{ margin: "20px auto", display: "block" }} />
      ) : meals.length > 0 ? (
        <Row gutter={[16, 16]} style={{ marginLeft: 0, marginRight: 0 }}>
          {filteredMeals.map((meal) => {
            const price = 10; // Sostituisci con il prezzo desiderato o un calcolo da un API
            return (
              <Col xs={24} sm={24} md={12} key={meal.idMeal}>
                <Card
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    flexDirection: "row-reverse",
                  }}
                  title={
                    <>
                      <QuantitySelector
                        mealId={meal.idMeal}
                        onChange={(quantity) =>
                          handleQuantityChange(meal.idMeal, quantity)
                        }
                      />
                    </>
                  }
                  bordered={true}
                >
                  <span
                    style={{
                      fontSize: 20,
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    {meal.strMeal}
                  </span>
                  <p style={{ width: "100%", height: "100%" }}>
                    <strong>Ingredienti:</strong> {meal.strIngredient1},
                    {meal.strIngredient2}, {meal.strIngredient3}, ...
                  </p>
                  <img
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    style={{
                      width: "100%",
                      height: "160px", // Riduci l'altezza dell'immagine
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "5px",
                    }}
                  />

                  {/* Mostra ingredienti qui */}
                
                </Card>
                <Button
                    type="primary"
                    onClick={() =>
                      addToCart({
                        id: meal.idMeal,
                        title: meal.strMeal,
                        image: meal.strMealThumb,
                        price: price,
                        quantity: quantities[meal.idMeal] || 1, // Usa la quantità selezionata o 1 di default
                      })
                    }
                    style={{
                      width: "100%",
                      padding: 20,
                      fontSize: 16,
                      fontWeight: "600",
                      backgroundColor: "#053EEF",
                    }}
                  >
                    + {translate("addToCart")}
                  </Button>
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
