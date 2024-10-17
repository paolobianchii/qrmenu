import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Typography, InputNumber, Spin, Radio } from 'antd';
import { useCart } from '../components/CartContext';

const { Title } = Typography;

const Menu = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All'); // Stato per i filtri
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
        const data = await response.json();
        if (data.meals) {
          setMeals(data.meals);
        }
      } catch (error) {
        console.error('Error fetching meals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  const filterMeals = (category) => {
    setSelectedCategory(category);
  };

  // Filtra i pasti in base alla categoria selezionata
  const filteredMeals = meals.filter(meal => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Vegetarian' && meal.strCategory === 'Vegetarian') return true;
    if (selectedCategory === 'Beef' && meal.strCategory === 'Beef') return true;
    if (selectedCategory === 'Chicken' && meal.strCategory === 'Chicken') return true;
    return false;
  });

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Spin size="large" />
        <p>Caricamento...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '10px' }}>
      <Title level={2}>Menu</Title>
      <p>Benvenuto/a, scopri il menu</p>

      {/* Filtri */}
      <div style={{ marginBottom: '20px' }}>
        <Radio.Group
          value={selectedCategory}
          onChange={(e) => filterMeals(e.target.value)}
          style={{ display: 'flex', justifyContent: 'space-around' }}
        >
          <Radio.Button value="All">Tutti</Radio.Button>
          <Radio.Button value="Vegetarian">Vegetariani</Radio.Button>
          <Radio.Button value="Beef">Carne</Radio.Button>
          <Radio.Button value="Chicken">Pollo</Radio.Button>
        </Radio.Group>
      </div>

      <Row gutter={[16, 16]}>
        {filteredMeals.map((meal) => (
          <Col xs={24} sm={24} md={24} key={meal.idMeal}>
            <Card
              title={meal.strMeal}
              bordered={true}
              style={{ marginBottom: '20px' }}
            >
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '10px',
                }}
              />
              <InputNumber
                min={1}
                defaultValue={1}
                style={{ marginBottom: '10px', width: '100%' }}
                id={`quantity-${meal.idMeal}`}
              />
              <Button
                type="primary"
                onClick={() => {
                  const quantity = parseInt(document.getElementById(`quantity-${meal.idMeal}`).value, 10);
                  if (quantity > 0) {
                    addToCart({
                      id: meal.idMeal,
                      title: meal.strMeal,
                      image: meal.strMealThumb,
                      price: 10 // Prezzo di esempio
                    }, quantity); // Passa la quantità
                  }
                }}
                style={{ width: '100%' }}
              >
                Aggiungi al carrello
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Menu;
