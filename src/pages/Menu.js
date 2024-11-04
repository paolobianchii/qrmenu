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
} from "antd";
import { useCart } from "../components/CartContext";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { FrownOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

// Componente per la selezione della quantità
const QuantitySelector = ({ mealId, meal }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const existingItem = cartItems.find((item) => item.id === mealId);
  const quantity = existingItem ? existingItem.quantity : 0;

  const handleQuantityChange = (change) => {
    if (quantity + change < 0) return; // Prevent negative quantities

    if (quantity === 0 && change > 0) {
      // Add new item to cart
      addToCart({
        id: mealId,
        title: meal.strMeal,
        image: meal.strMealThumb,
        price: meal.price, // Using the fixed price from your UI
        quantity: 1
      });
    } else if (quantity > 0) {
      // Update existing item quantity
      updateQuantity(mealId, change);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Button
        onClick={() => handleQuantityChange(-1)}
        style={{
          fontSize: 25,
          width: "30%",
          backgroundColor: "#000000",
          border: "none",
          color: "#fff",
        }}
      >
        -
      </Button>
      <span
        style={{
          margin: "0 10px",
          fontSize: 20,
          fontWeight: "600",
          color: "#fff",
        }}
      >
        {quantity}
      </span>
      <Button
        onClick={() => handleQuantityChange(1)}
        style={{
          fontSize: 25,
          width: "30%",
          backgroundColor: "#000000",
          border: "none",
          color: "#fff",
        }}
      >
        +
      </Button>
    </div>
  );
};

// Componente principale del menu
const Menu = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [language, setLanguage] = useState("it");
  const [/*subFilters*/, setSubFilters] = useState([]);
  const [/*filterTitle*/, setFilterTitle] = useState("Tutti i Prodotti"); // Aggiungi il titolo del filtro

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") || "it";
    setLanguage(storedLanguage);
  
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
        const data = await response.json();
        
        // Controlla se ci sono pasti e aggiungi il prezzo
        if (data.meals) {
          const mealsWithPrice = data.meals.map(meal => ({
            ...meal,
            price: (Math.random() * (20 - 5) + 5).toFixed(2) // Prezzo casuale tra 5 e 20 euro
          }));
  
          setMeals(mealsWithPrice);
          setFilteredMeals(mealsWithPrice); // Imposta subito tutti i pasti su filteredMeals
        } else {
          console.error("Nessun pasto trovato nell'API.");
          setMeals([]); // Imposta meals come un array vuoto se non ci sono pasti
          setFilteredMeals([]); // Imposta filteredMeals come un array vuoto
        }
      } catch (error) {
        console.error("Error fetching meals:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMeals();
  }, []);
  

  const handleFilterChange = (value) => {
    setSelectedCategory(value);
    setLoading(true); // Imposta loading a true quando si avvia il filtro

    window.scrollTo(0, 0);

    if (value === "All") {
      setFilteredMeals(meals);
      setSubFilters([]);
      setFilterTitle("Tutti i Prodotti");
    } else {
      switch (value) {
        case "Primi Piatti":
          setFilterTitle("Filtro per: Primi Piatti");
          setSubFilters(["Pasta", "Riso"]);
          setFilteredMeals(
            meals.filter(
              (meal) =>
                meal.strCategory === "Pasta" || meal.strCategory === "Rice"
            )
          );
          break;
        case "Secondi Piatti":
          setFilterTitle("Filtro per: Secondi Piatti");
          setSubFilters(["Carne", "Pesce"]);
          setFilteredMeals(
            meals.filter(
              (meal) =>
                meal.strCategory === "Beef" ||
                meal.strCategory === "Chicken" ||
                meal.strCategory === "Pork" ||
                meal.strCategory === "Seafood"
            )
          );
          break;
        case "Dessert":
          setFilterTitle("Filtro per: Dessert");
          setSubFilters(["Gelato", "Torta"]);
          setFilteredMeals(
            meals.filter(
              (meal) =>
                meal.strCategory === "Dessert" ||
                meal.strCategory === "Cake" ||
                meal.strCategory === "Ice Cream"
            )
          );
          break;
        default:
          setFilterTitle("Tutti i Prodotti");
          setFilteredMeals(meals);
      }
    }

    // Imposta `loading` su `false` dopo un breve ritardo per simulare il caricamento
    setTimeout(() => {
      setLoading(false);
    }, 400); // Aggiungi un ritardo per rendere più fluida la transizione
  };


  const getIngredients = (meal) => {
    return Array.from(
      { length: 20 },
      (_, i) => meal[`strIngredient${i + 1}`]
    ).filter((ingredient) => ingredient);
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


  return (
    <div>
      <div
        className="sticky-header"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          flexDirection: "row",
          zIndex: 1000,
          backgroundColor: "#fff",
          padding: "10px 0",
        }}
      >
        <Title level={2} style={{ marginLeft: 20 }}>
          {translate("menu")}
        </Title>
        <Select
          value={language}
          onChange={handleLanguageChange}
          style={{
            width: 120,
            marginLeft: "auto",
            marginTop: 7,
            marginRight: 10,
          }}
        >
          <Option value="it">Italiano</Option>
          <Option value="en">English</Option>
        </Select>
      </div>

      <div
        className="filter-container"
        style={{
          position: "fixed",
          top: 55,
          left: 0,
          width: "100%",
          overflowX: "auto",
          whiteSpace: "nowrap",
          backgroundColor: "#fff",
          borderRadius: "8px",
          marginTop: 15,
          marginBottom: 0,
          zIndex: 1000,
        }}
      >
        <Radio.Group
          value={selectedCategory}
          onChange={(e) => handleFilterChange(e.target.value)}
          style={{ display: "flex", justifyContent: "flex-start", padding: 20 }}
        >
          <Radio.Button value="All" style={buttonStyle}>
            {translate("all")}
          </Radio.Button>
          <Radio.Button value="Primi Piatti" style={buttonStyle}>
            {translate("primi")}
          </Radio.Button>
          <Radio.Button value="Secondi Piatti" style={buttonStyle}>
            {translate("secondi")}
          </Radio.Button>
          <Radio.Button value="Dessert" style={buttonStyle}>
            {translate("dessert")}
          </Radio.Button>
        </Radio.Group>
      </div>

      <TransitionGroup
        component={Row}
        gutter={16}
        style={{
          marginLeft: 0,
          marginRight: 0,
          marginBottom: 55,
          backgroundColor: "#FCFCFC",
          // Rimuovi il marginTop fisso e considera l'uso di padding o margin in modo dinamico
          paddingTop: "158px", // Puoi aggiustare questo valore in base alla tua necessità
        }}
        justify="center"
      >
        {loading ? (
          <CSSTransition key="spinner" timeout={300} classNames="fade">
            <Spin size="large" style={{ marginTop: 200 }} />
          </CSSTransition>
        ) : filteredMeals.length > 0 ? (
          filteredMeals.map((meal) => (
            <CSSTransition key={meal.idMeal} timeout={300} classNames="fade">
              <Col
                span={11}
                key={meal.idMeal}
                style={{ marginBottom: 20, display: "flex" }}
              >
                <Card
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                  hoverable
                  cover={
                    <div style={{ position: "relative" }}>
                      <img
                        alt={meal.strMeal}
                        src={meal.strMealThumb}
                        style={{ width: "100%", height: "auto" }}
                      />
                      <span
                      key="price"
                        style={{
                          position: "absolute",
                          bottom: "18px",
                          right: "18px",
                          backgroundColor: "rgba(0, 0, 0, 0.7)",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize:17,
                          fontWeight:"700"
                        }}
                      >
                        € {meal.price}
                      </span>
                    </div>
                  }
                  actions={[
                    <QuantitySelector
                      key="quantity"
                      mealId={meal.idMeal}
                      meal={meal}
                    />,
                  ]}
                >
                  <h1 style={{marginTop:-15}}>{meal.strMeal}</h1>
                  <div
                    style={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      overflow: "auto",
                      justifyContent: "space-between",
                      height: "100px",
                    }}
                  >
                    <Card.Meta description={getIngredients(meal).join(", ")} />
                  </div>
                </Card>
              </Col>
            </CSSTransition>
          ))
        ) : (
          <CSSTransition timeout={300} classNames="fade">
            <div style={{ textAlign: "center", marginTop: "220px" }}>
              <FrownOutlined style={{ fontSize: "48px", color: "#ccc" }} />
              <div style={{ marginTop: 20 }}>
                <span style={{ fontSize: 22 }}>
                  {translate("noMealsFound")}
                </span>
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </div>
  );
};

// Stili per i pulsanti
const buttonStyle = {
  margin: "0 10px",
  fontSize: 17,
  borderRadius: 5,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export default Menu;
