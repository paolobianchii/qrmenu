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
      style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
    >
      <Button onClick={handleDecrement} style={{ flex: "1" }}>
        {" "}
        -{" "}
      </Button>
      <span style={{ margin: "0 10px" }}>{quantity}</span>
      <Button onClick={handleIncrement} style={{ flex: "1" }}>
        {" "}
        +{" "}
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

  const spicinessMapping = {
    Mexican: "high",
    Indian: "high",
    Thai: "medium",
    Italian: "low",
    // Aggiungi altre categorie secondo necessità
  };

  const getSpiciness = (meal) => {
    const category = meal.strCategory; // Usa la categoria del pasto per determinare la piccantezza
    return spicinessMapping[category] || "low"; // Ritorna 'low' se la categoria non è mappata
  };

  // Funzione per determinare l'icona di piccantezza
  const getSpicinessIcon = (spiciness) => {
    switch (spiciness) {
      case "low":
        return <FaAdjust style={{ color: "green", marginLeft: "10px" }} />;
      case "medium":
        return <FaPepperHot style={{ color: "orange", marginLeft: "10px" }} />;
      case "high":
        return <FaFire style={{ color: "red", marginLeft: "10px" }} />;
      default:
        return null;
    }
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
          <Option value="it"><FlagFilled/> Italiano</Option>
          <Option value="en"><FlagFilled/> English</Option>
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
          padding: "5px",
          backgroundColor: "transparent",
          borderRadius: "8px",
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
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "21px",
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
              borderRadius: "21px",
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
              borderRadius: "21px",
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
              borderRadius: "21px",
            }}
          >
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
            const spiciness = getSpiciness(meal);
            return (
              <Col xs={24} sm={24} md={12} key={meal.idMeal}>
                <Card
                  title={
                    <span>
                      {meal.strMeal}
                      {getSpicinessIcon(spiciness)}
                    </span>
                  }
                  bordered={true}
                  style={{ marginBottom: "20px" }}
                >
                  <img
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    style={{
                      width: "100%",
                      height: "150px", // Riduci l'altezza dell'immagine
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "10px",
                    }}
                  />
                  <p>
                    <strong>Ingredienti:</strong> {meal.strIngredient1},{" "}
                    {meal.strIngredient2}, {meal.strIngredient3}, ...
                  </p>{" "}
                  {/* Mostra ingredienti qui */}
                  <QuantitySelector
                    mealId={meal.idMeal}
                    onChange={(quantity) =>
                      handleQuantityChange(meal.idMeal, quantity)
                    }
                  />
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
