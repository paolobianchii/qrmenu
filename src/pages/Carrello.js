import React, { useState } from "react";
import { useCart } from "../components/CartContext"; // Assicurati che il percorso sia corretto
import { List, Typography, Button, Modal, Form, Input, Select } from "antd";
import { Trash2 } from "react-feather";
import {
  ShoppingCartOutlined,
  CreditCardOutlined,
  UserOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { Option } from "antd/es/mentions";

const { Title } = Typography;

const Carrello = () => {
  const { cartItems, totalQuantity, totalPrice, removeFromCart } =
    useCart();
    const [language, setLanguage] = useState("it");

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleLanguageChange = (value) => {
    setLanguage(value);
    localStorage.setItem("language", value);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    // Aggiungi la logica per il pagamento qui (ad es. invio dei dati al server)
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          padding: "10px 10px",
          zIndex: 1000,
        }}
      >
        <Title level={2}>Carrello</Title>
        <Select
          value={language}
          onChange={handleLanguageChange}
          style={{
            width: 120,
            marginLeft: "auto",
            marginTop: 7,
            marginRight: 20,
          }}
        >
          <Option value="it">Italiano</Option>
          <Option value="en">English</Option>
        </Select>
      </div>
      {totalQuantity === 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            height: "60vh", // Imposta un'altezza per centrare verticalmente
            textAlign: "center",
          }}
        >
          <ShoppingCartOutlined style={{ fontSize: 64, color: "#888" }} />
          <p style={{ fontSize: 18, color: "#888", marginTop: 20 }}>
            Il carrello è vuoto.
          </p>
        </div>
      ) : (
        <div style={{ padding: 10, marginBottom: 290, marginTop:70 }}>
          <List
            itemLayout="horizontal"
            dataSource={cartItems}
            renderItem={(item) => (
              <List.Item
              style={{backgroundColor:"#f3f3f3", padding:10, borderRadius:10,marginTop:10, border:"1.5px solid #d5d5d5"}}
                actions={[
                  <Button onClick={() => removeFromCart(item.id)}>
                    <Trash2 style={{ width: 14 }} /> Rimuovi
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: 100, height: 100, objectFit: "cover" }}
                    />
                  }
                  title={
                    <span style={{ fontWeight: "bold", fontSize:20 }}>{item.title}</span>
                  }
                  description={
                    <span style={{fontSize:16}}>
                      Prezzo:{" "}
                      <span style={{ fontWeight: "bold", color: "#a9a9a9" }}>
                        {item.price} €
                      </span>{" "}
                       Quantità:{" "}
                      <span style={{ fontWeight: "bold", color: "#a9a9a9" }}>
                        {item.quantity}
                      </span>
                    </span>
                  }
                />
              </List.Item>
            )}
          />

          {/* Bottoni aggiuntivi */}
          <div
            style={{
              position: "fixed",
              bottom: 50,
              left: 0,
              right: 0,
              backgroundColor: "#fff",
              borderTop: "1px solid #ddd",
              display: "flex",
              justifyContent: "space-around",
              flexDirection: "row",
              alignItems: "center",
              height: 68,
            }}
          >
            <h3>Totale: {totalPrice} €</h3>
            <Button
              type="primary"
              onClick={showModal}
              style={{
                fontSize: 16,
                fontWeight: "600",
                border: "1.4px solid #053EEF",
                color: "#053EEF",
                backgroundColor: "#fff",
              }}
            >
              Procedi al pagamento
            </Button>
          </div>
        </div>
      )}

      <Modal
        title="Pagamento"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel} type="danger">
            Cancella
          </Button>,
          <Button key="pay" type="primary" onClick={handleOk}>
            Paga
          </Button>,
        ]}
        centered // Centra il modale
        style={{ padding: "20px" }} // Aggiunge padding al modale
      >
        <Form layout="vertical" name="paymentForm">
          <Form.Item
            label={
              <span>
                <UserOutlined /> Nome
              </span>
            } // Icona vicino al nome
            name="firstName"
            rules={[
              { required: true, message: "Per favore inserisci il tuo nome" },
            ]}
          >
            <Input placeholder="Inserisci il tuo nome" />
          </Form.Item>

          <Form.Item
            label={
              <span>
                <UserOutlined /> Cognome
              </span>
            } // Icona vicino al cognome
            name="lastName"
            rules={[
              {
                required: true,
                message: "Per favore inserisci il tuo cognome",
              },
            ]}
          >
            <Input placeholder="Inserisci il tuo cognome" />
          </Form.Item>

          <Form.Item
            label={
              <span>
                <TableOutlined /> Tavolo
              </span>
            } // Icona vicino al tavolo
            name="table"
            rules={[
              {
                required: true,
                message: "Per favore inserisci il numero del tavolo",
              },
            ]}
          >
            <Input type="number" placeholder="Inserisci il numero del tavolo" />
          </Form.Item>

          <Form.Item
            label={
              <span>
                <CreditCardOutlined /> Numero Carta
              </span>
            } // Icona vicino al numero di carta
            name="cardNumber"
            rules={[
              {
                required: true,
                message: "Per favore inserisci il numero della carta",
              },
            ]}
          >
            <Input
              type="number"
              placeholder="Inserisci il numero della carta"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Carrello;
