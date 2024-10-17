import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Typography, InputNumber, Spin } from 'antd';
import { useCart } from '../components/CartContext';

const { Title } = Typography;

const Menu = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
        const data = await response.json();
        console.log('Data fetched:', data); // Aggiungi questo log
        if (data.meals) {
          setMeals(data.meals);
        } else {
          setMeals([]); // Imposta un array vuoto se non ci sono pasti
        }
      } catch (error) {
        console.error('Error fetching meals:', error);
        setMeals([]); // Imposta un array vuoto in caso di errore
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  return (
    <div style={{ padding: '10px' }}>
      <Title level={2}>Menu</Title>
      <p>Benvenuto/a, scopri il menu</p>
      {loading ? (
        <Spin size="large" style={{ margin: '20px auto', display: 'block' }} />
      ) : meals.length > 0 ? (
        <Row gutter={[16, 16]}>
          {meals.map((meal) => (
            <Col xs={24} sm={24} md={24} key={meal.idMeal}>
              <Card title={meal.strMeal} bordered={true} style={{ marginBottom: '20px' }}>
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
                        price: 10,
                      }, quantity);
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
      ) : (
        <p>Nessun pasto trovato.</p>
      )}
    </div>
  );
};

export default Menu;
