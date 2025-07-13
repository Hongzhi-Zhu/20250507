import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";

const PREF_MAP = {
  0: "water",
  3: "soda",
  7: "peach_juice"
};

function App() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    preferences: '',
    affiliate: false
  });

  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/get_users/");
      setUsers(res.data);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post("http://localhost:8000/api/post_user/", form);
      setForm({ name: '', email: '', preferences: '', affiliate: false });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Error desconocido');
    }
  };

  return (
    <Container fluid className="p-4">
      <Row>
        <Col md={4}>
          <h3>Registrar Usuario</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Preferencias (separadas por comas)</Form.Label>
              <Form.Control
                value={form.preferences}
                onChange={e => setForm({ ...form, preferences: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Afiliado"
                checked={form.affiliate}
                onChange={e => setForm({ ...form, affiliate: e.target.checked })}
              />
            </Form.Group>
            <Button type="submit">Enviar</Button>
          </Form>
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </Col>

        <Col md={8}>
          <h3>Usuarios</h3>
          <Row>
            {users.map((u, idx) => (
              <Col sm={6} lg={4} key={idx} className="mb-3">
                <Card.Body style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
				  {"\"name\": \"" + u.name + "\",\n"}
				  {"\"email\": \"" + u.email + "\",\n"}
				  {"\"preferences\":\n [" + u.preferences.map(num => `'${PREF_MAP[num] || 'unknown'}'`).join(", ") + "],\n"}
				  {"\"affiliate\": " + (u.affiliate ? "True" : "False")}
				</Card.Body>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
