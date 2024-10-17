import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Spin,
  Radio,
} from "antd";
import { useCart } from "../components/CartContext";
import {
  CoffeeOutlined,
  ShopOutlined,
  DribbbleOutlined,
  FireOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

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
      <Button onClick={handleDecrement} style={{ flex: "1" }}>-</Button>
      <span style={{ margin: "0 10px" }}>{quantity}</span>
      <Button onClick={handleIncrement} style={{ flex: "1" }}>+</Button>
    </div>
  );
};

const Menu = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { addToCart } = useCart();

  useEffect(() => {
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

  return (
    <div style={{ padding: "10px" }}>
      <div className="sticky-header">
        <Title level={2}>Menu</Title>
        <p>Benvenuto/a, scopri il menu</p>

        {/* Filtri */}
        <div className="filter-container">
          <Radio.Group
            value={selectedCategory}
            onChange={(e) => filterMeals(e.target.value)}
            style={{ display: "flex", justifyContent: "space-around" }}
          >
            <Radio.Button
              value="All"
              style={{ display: "flex", alignItems: "center", color: "#1890ff" }} // Colore blu
            >
              <CoffeeOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
              Tutti
            </Radio.Button>
            <Radio.Button
              value="Vegetarian"
              style={{ display: "flex", alignItems: "center", color: "#73d13d" }} // Colore verde
            >
              <ShopOutlined style={{ marginRight: "8px", color: "#73d13d" }} />
              Vegetariani
            </Radio.Button>
            <Radio.Button
              value="Beef"
              style={{ display: "flex", alignItems: "center", color: "#ff4d4f" }} // Colore rosso
            >
              <FireOutlined style={{ marginRight: "8px", color: "#ff4d4f" }} />
              Carne
            </Radio.Button>
            <Radio.Button
              value="Chicken"
              style={{ display: "flex", alignItems: "center", color: "#faad14" }} // Colore giallo
            >
              <DribbbleOutlined style={{ marginRight: "8px", color: "#faad14" }} />
              Pollo
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>

      {loading ? (
        <Spin size="large" style={{ margin: "20px auto", display: "block" }} />
      ) : meals.length > 0 ? (
        <Row gutter={[16, 16]}>
          {filteredMeals &&
            filteredMeals.map((meal) => (
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
                      // Puoi anche gestire lo stato della quantità se necessario
                    }}
                  />
                  <Button
                    type="primary"
                    onClick={() => {
                      // Puoi passare il valore della quantità dalla state
                      addToCart(
                        {
                          id: meal.idMeal,
                          title: meal.strMeal,
                          image: meal.strMealThumb,
                          price: 10, // Prezzo di esempio
                        },
                        1 // Modifica qui se vuoi passare la quantità
                      );
                    }}
                    style={{ width: "100%" }}
                  >
                    Aggiungi al carrello
                  </Button>
                </Card>
              </Col>
            ))}
        </Row>
      ) : (
        <p>Nessun pasto trovato.</p>
      )}
    </div>
  );
};

export default Menu;
