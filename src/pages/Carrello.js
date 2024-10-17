import React from 'react';
import { useCart } from '../components/CartContext';
import { List, Typography, Button } from 'antd';

const { Title } = Typography;

const Carrello = () => {
  const { cartItems, totalQuantity, totalPrice, removeFromCart } = useCart();

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Carrello</Title>
      {totalQuantity === 0 ? (
        <p>Il carrello è vuoto.</p>
      ) : (
        <div>
          <List
            itemLayout="horizontal"
            dataSource={cartItems}
            renderItem={item => (
              <List.Item
                actions={[<Button onClick={() => removeFromCart(item.id)}>Rimuovi</Button>]}
              >
                <List.Item.Meta
                  title={item.title}
                  description={`Prezzo: ${item.price} € | Quantità: ${item.quantity}`}
                />
              </List.Item>
            )}
          />
          <h3>Totale: {totalPrice} €</h3>
        </div>
      )}
    </div>
  );
};

export default Carrello;
