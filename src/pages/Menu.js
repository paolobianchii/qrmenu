import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Spin,
  Radio,
  Select,
  notification,
} from "antd";
import { useCart } from "../components/CartContext";
import { FaUtensils, FaPizzaSlice, FaHamburger, FaIceCream } from "react-icons/fa";

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
    } else if (category === "Primi Piatti") {
      const filtered = meals.filter((meal) => meal.strCategory === "Pasta" || meal.strCategory === "Soup");
      setFilteredMeals(filtered);
    } else if (category === "Secondi Piatti") {
      const filtered = meals.filter((meal) => meal.strCategory === "Beef" || meal.strCategory === "Chicken");
      setFilteredMeals(filtered);
    } else if (category === "Dessert") {
      const filtered = meals.filter((meal) => meal.strCategory === "Dessert");
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
        primi: "Primi Piatti",
        secondi: "Secondi Piatti",
        dessert: "Dessert",
        addToCart: "Aggiungi al carrello",
        noMealsFound: "Nessun pasto trovato.",
      },
      en: {
        menu: "Menu",
        filter: "Filter by category",
        all: "All",
        primi: "First Courses",
        secondi: "Second Courses",
        dessert: "Dessert",
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

  const notifyAddToCart = (meal) => {
    notification.success({
      message: `Aggiunto al carrello`,
      description: `${meal.strMeal} è stato aggiunto al carrello.`,
      placement: "topRight",
    });
  };

  return (
    <div>
      <div
        className="sticky-header"
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Title level={2} style={{marginLeft:10}}>{translate("menu")}</Title>
        <Select
          value={language}
          onChange={handleLanguageChange}
          style={{ width: 120, marginLeft: "auto", marginTop: 7 }}
        >
          <Option value="it">Italiano</Option>
          <Option value="en">English</Option>
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
          marginBottom: 0,
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
              backgroundColor: "#fff",
              color: "#053EEF",
              fontSize: 15,
              fontWeight: "600",
            }}
          >
            <FaUtensils /> {translate("all")}
          </Radio.Button>
          <Radio.Button
            value="Primi Piatti"
            style={{
              margin: "0 10px",
              padding: 18,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              backgroundColor: "#fff",
              color: "#053EEF",
              fontSize: 15,
              fontWeight: "600",
            }}
          >
            <FaPizzaSlice /> {translate("primi")}
          </Radio.Button>
          <Radio.Button
            value="Secondi Piatti"
            style={{
              margin: "0 10px",
              padding: 18,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              backgroundColor: "#fff",
              color: "#053EEF",
              fontSize: 15,
              fontWeight: "600",
            }}
          >
            <FaHamburger /> {translate("secondi")}
          </Radio.Button>
          <Radio.Button
            value="Dessert"
            style={{
              margin: "0 10px",
              padding: 18,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              backgroundColor: "#fff",
              color: "#053EEF",
              fontSize: 15,
              fontWeight: "600",
            }}
          >
            <FaIceCream /> {translate("dessert")}
          </Radio.Button>
        </Radio.Group>
      </div>

      {loading ? (
        <Spin size="large" style={{ margin: "20px auto", display: "block" }} />
      ) : meals.length > 0 ? (
        <Row gutter={[16, 16]} style={{ marginLeft: 0, marginRight: 0, paddingBottom:100 }}>
          {filteredMeals.map((meal) => {
            const price = 10; // Sostituisci con il prezzo desiderato o un calcolo da un API
            return (
              <Col xs={24} sm={24} md={12} key={meal.idMeal}>
                <Card
                  style={{
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                    padding: "15px", // Ridotto per dispositivi mobili
                    margin: "10px", // Spaziatura più contenuta
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "transform 0.2s ease, box-shadow 0.3s ease",
                  }}
                  bordered={false}
                >
                  <img
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    style={{
                      height: "160px", // Altezza ridotta per un layout mobile
                      width: "100%",
                      objectFit: "cover",
                      borderRadius: "5px",
                      marginBottom: "10px",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "stretch",
                      marginTop: "10px",
                    }}
                  >
                    <div style={{ flexGrow: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "1.6rem",
                            fontWeight: "bold",
                            color: "#282828",
                          }}
                        >
                          {meal.strMeal}
                        </span>
                        <QuantitySelector
                          mealId={meal.idMeal}
                          onChange={(quantity) =>
                            handleQuantityChange(meal.idMeal, quantity)
                          }
                          style={{ width: "auto" }}
                        />
                      </div>

                      <p
                        style={{
                          fontSize: "1.1rem",
                          color: "#282828",
                          marginBottom: "5px",
                        }}
                      >
                        <strong>Ingredienti:</strong>
                      </p>
                      <ul
                        style={{
                          paddingLeft: "0px",
                          margin: 0,
                          listStyleType: "none",
                          fontSize: "0.9rem",
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "wrap",
                        }}
                      >
                        {[
                          meal.strIngredient1,
                          meal.strIngredient2,
                          meal.strIngredient3,
                        ]
                          .filter(Boolean)
                          .map((ingredient, index) => (
                            <li
                              key={index}
                              style={{ marginRight: "5px", color: "#888" }}
                            >
                              {ingredient}
                            </li>
                          ))}
                      </ul>
                    </div>
                    <hr></hr>
                    <Button
                      type="primary"
                      onClick={() => {
                        addToCart({
                          id: meal.idMeal,
                          title: meal.strMeal,
                          image: meal.strMealThumb,
                          price: price,
                          quantity: quantities[meal.idMeal] || 1,
                        });
                        notifyAddToCart(meal);
                      }}
                      style={{
                        width: "100%", // Larghezza al 100% per il pulsante
                        padding: "12px", // Padding maggiore per migliorare l'usabilità
                        fontSize: "1rem",
                        fontWeight: "600",
                        backgroundColor: "#fff",
                        border: "1.5px solid #053EEF",
                        height: 40,
                        color: "#053EEF",
                        transition:
                          "background-color 0.3s ease, transform 0.2s ease",
                      }}
                    >
                      {translate("addToCart")}
                    </Button>
                  </div>
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
