// src/pages/Pagamento.js
import React from 'react';
import { Typography, Button } from 'antd';
import { useCart } from '../components/CartContext';

const { Title } = Typography;

const Pagamento = () => {
  const { cart } = useCart();
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Pagina di Pagamento</Title>
      {cart.length === 0 ? (
        <p>Il carrello è vuoto. Aggiungi dei prodotti prima di procedere.</p>
      ) : (
        <>
          <h3>Riepilogo Ordine:</h3>
          <ul>
            {cart.map(item => (
              <li key={item.id}>
                {item.title} - Prezzo: {item.price}€ x {item.quantity}
              </li>
            ))}
          </ul>
          <h3>Totale: {total}€</h3>
          <Button type="primary" onClick={() => alert('Ordine completato!')}>
            Completa Ordine
          </Button>
        </>
      )}
    </div>
  );
};

export default Pagamento;
