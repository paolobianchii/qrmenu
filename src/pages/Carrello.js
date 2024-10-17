import React from 'react';
import { useCart } from '../components/CartContext'; // Assicurati che il percorso sia corretto
import { List, Typography, Button } from 'antd';

const { Title } = Typography;

const Carrello = () => {
  const { cartItems, totalQuantity, totalPrice, removeFromCart } = useCart();

  return (
    <div>
      <div
        className="sticky-header"
      >
      <Title level={2}>Carrello</Title>
      </div>
      {totalQuantity === 0 ? (
        <p>Il carrello è vuoto.</p>
      ) : (
        <div style={{padding:10}}>
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
