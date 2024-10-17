// src/App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom'; // Assicurati di importare BrowserRouter in un altro file come index.js
import Carrello from './pages/Carrello';
import TabBar from './components/TabBar';
import './App.css';
import Menu from './pages/Menu';
import { CartProvider } from './components/CartContext';
import Pagamento from './pages/Pagamento';

function App() {
  return (
    <CartProvider>
      <div className="app-container">
        <div className="content">
          <Routes>
            <Route exact path="/qrmenu" element={<Menu />} />
            <Route path="/carrello" element={<Carrello />} />
            <Route path="/pagamento" element={<Pagamento />} /> {/* Cambiato 'component' in 'element' */}
          </Routes>
        </div>
        <TabBar />
      </div>
    </CartProvider>
  );
}

export default App;
