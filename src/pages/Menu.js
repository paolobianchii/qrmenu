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
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { FrownOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

// Componente per la selezione della quantità
const QuantitySelector = ({ mealId, meal, onQuantityChange }) => {
  const { cartItems } = useCart();
  const existingItem = cartItems.find((item) => item.id === mealId);
  const initialQuantity = existingItem ? existingItem.quantity : 0;
  const [quantity, setQuantity] = useState(initialQuantity);

  useEffect(() => {
    setQuantity(existingItem ? existingItem.quantity : 0);
  }, [existingItem]);

  const handleChange = (newQuantity) => {
    if (newQuantity < 0) return; // Previene la quantità negativa
    setQuantity(newQuantity);
    onQuantityChange(mealId, meal, newQuantity - initialQuantity); // Passa la differenza
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
        onClick={() => handleChange(quantity - 1)}
        style={{ fontSize: 25, width: "30%" }}
      >
        -
      </Button>
      <span style={{ margin: "0 10px", fontSize: 20, fontWeight: "600" }}>
        {quantity}
      </span>
      <Button
        onClick={() => handleChange(quantity + 1)}
        style={{ fontSize: 25, width: "30%" }}
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
  const { addToCart } = useCart();
  const [subFilters, setSubFilters] = useState([]);

  const [quantities, setQuantities] = useState({});
  const [filterTitle, setFilterTitle] = useState("Tutti i Prodotti"); // Aggiungi il titolo del filtro

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
          setFilteredMeals(data.meals); // Imposta subito tutti i pasti su filteredMeals
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

  const filterMeals = (category, filter) => {
    let filtered = [];

    if (category === "Primi Piatti") {
      filtered = meals.filter((meal) =>
        filter === "Pasta"
          ? meal.strCategory === "Pasta"
          : meal.strCategory === "Rice"
      );
    } else if (category === "Secondi Piatti") {
      filtered = meals.filter((meal) =>
        filter === "Carne"
          ? meal.strCategory.includes("Beef") ||
            meal.strCategory.includes("Chicken") ||
            meal.strCategory.includes("Pork")
          : meal.strCategory.includes("Seafood")
      );
    } else if (category === "Dessert") {
      filtered = meals.filter((meal) =>
        filter === "Gelato"
          ? meal.strCategory === "Ice Cream"
          : meal.strCategory === "Cake"
      );
    }

    setFilteredMeals(filtered);
  };

  const handleQuantityChange = (mealId, meal, quantityChange) => {
    const newQuantity = (quantities[mealId] || 0) + quantityChange;

    if (newQuantity > 0) {
      addToCart({
        id: mealId,
        title: meal.strMeal,
        image: meal.strMealThumb,
        price: 10, // Sostituisci con il prezzo reale
        quantity: newQuantity,
      });
      setQuantities({ ...quantities, [mealId]: newQuantity });
      notifyAddToCart(meal);
    } else {
      // Rimuovi il pasto dal carrello se la quantità è zero o inferiore
      const { [mealId]: _, ...rest } = quantities;
      setQuantities(rest);
    }
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
      message: translate("addToCart"),
      description: `${meal.strMeal} ${translate("addedToCart")}`,
      placement: "bottomRight",
    });
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
          padding: "5px",
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
          style={{ display: "flex", justifyContent: "flex-start" }}
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

        {/* Sottofiltri */}
        {selectedCategory !== "All" && (
          <div
            style={{
              position: "fixed",
              top: 106,
              left: 0,
              width: "100%",
              overflowX: "auto",
              whiteSpace: "nowrap",
              padding: "5px",
              backgroundColor: "#fff",
              borderRadius: "8px",
              marginTop: 5,
              paddingLeft: 10,
              zIndex: 1000,
            }}
          >
            {subFilters.map((filter) => (
              <Button
                key={filter}
                onClick={() => filterMeals(selectedCategory, filter)}
                style={{ margin: "0 5px" }}
              >
                {filter}
              </Button>
            ))}
            <Title
              level={4}
              style={{ marginTop: 7, padding: 8, marginLeft: 0 }}
            >
              {filterTitle === undefined ? "Tutti i prodotti" : filterTitle}
            </Title>
          </div>
        )}
      </div>

      <TransitionGroup
        component={Row}
        gutter={16}
        style={{
          marginLeft: 0,
          marginRight: 0,
          marginBottom: 55,
          // Rimuovi il marginTop fisso e considera l'uso di padding o margin in modo dinamico
          paddingTop: "186px", // Puoi aggiustare questo valore in base alla tua necessità
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
              <Col span={11} key={meal.idMeal} style={{ marginBottom: 20 }}>
                <Card
                  hoverable
                  cover={<img alt={meal.strMeal} src={meal.strMealThumb} />}
                  actions={[
                    <QuantitySelector
                      mealId={meal.idMeal}
                      meal={meal}
                      onQuantityChange={handleQuantityChange}
                    />,
                  ]}
                >
                  <Card.Meta
                    title={meal.strMeal}
                    description={meal.strCategory}
                  />
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
  fontSize: 16,
  border:"1.5px solid #d9d9d9"
};

export default Menu;
