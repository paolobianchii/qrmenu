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
        <Title level={2}>{/*{translate("menu")}*/}</Title>
        <Select
          value={language}
          onChange={handleLanguageChange}
          style={{ width: 120, marginLeft: "auto", marginTop: 7 }}
        >
          <Option value="it">
            Italiano
          </Option>
          <Option value="en">
            English
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
          marginBottom:0
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
              border:"2px solid #053EEF",
              color: "#053EEF",
              borderRadius:10,
              fontSize:15,
              fontWeight:"600"
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
              backgroundColor: "#fff",
              border:"2px solid #5BA525",
              color: "#5BA525",
              borderRadius:10,
              fontSize:15,
              fontWeight:"600"
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
              backgroundColor: "#fff",
              border:"2px solid #AA3C3B",
              color: "#AA3C3B",
              borderRadius:10,
              fontSize:15,
              fontWeight:"600"
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
              backgroundColor: "#fff",
              border:"2px solid #ECA237",
              color: "#ECA237",
              borderRadius:10,
              fontSize:15,
              fontWeight:"600"
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
                      width:"100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "10px",
                      border: "1px solid #e0e0e0",
                    }}
                  />

                  <div style={{ flexGrow: 1, marginBottom: "10px" }}>
                  <span
                      style={{
                        fontSize: "1.6rem",
                        fontWeight: "bold",
                        color: "#282828",
                      }}
                    >
                      {meal.strMeal}
                    </span>
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
                        paddingLeft: "10px",
                        margin: 0,
                        listStyleType: "disc",
                        fontSize: "0.9rem",
                      }}
                    >
                      <li>{meal.strIngredient1}</li>
                      <li>{meal.strIngredient2}</li>
                      <li>{meal.strIngredient3}</li>
                      {/* Aggiungi ulteriori ingredienti se necessario */}
                    </ul>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "stretch",
                      marginTop: "10px",
                    }}
                  >
                    <QuantitySelector
                      mealId={meal.idMeal}
                      onChange={(quantity) =>
                        handleQuantityChange(meal.idMeal, quantity)
                      }
                      style={{ marginBottom: "10px", width: "100%" }} // Larghezza al 100% per il selettore di quantità
                    />
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
                        height:40,
                        color: "#053EEF",
                        transition:
                          "background-color 0.3s ease, transform 0.2s ease",
                      }}
                    >
                      + {translate("addToCart")}
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
