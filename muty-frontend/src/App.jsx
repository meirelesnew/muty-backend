import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Package, PlusCircle } from 'lucide-react';

function App() {
  const [items, setItems] = useState([]);
  const [newName, setNewName] = useState(""); // Estado para o formulário
  const API_URL = "https://muty-backend-meireles.fly.dev/items";

  // Função para buscar dados
  const loadItems = () => {
    axios.get(API_URL)
      .then(res => setItems(res.data))
      .catch(err => console.error("Erro ao carregar:", err));
  };

  useEffect(() => {
    loadItems();
  }, []);

  // Função para cadastrar novo item
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName) return;
    
    try {
      await axios.post(API_URL, { name: newName });
      setNewName(""); // Limpa o campo
      loadItems();    // Atualiza a lista/gráfico
    } catch (err) {
      alert("Erro ao salvar! Verifique o CORS no backend.");
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <h1 style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#1a1a1a' }}>
        <LayoutDashboard size={32} color="#646cff" /> Muty System | Dashboard
      </h1>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
        {/* Card de Total */}
        <div style={{ background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', flex: '1 1 300px' }}>
          <div style={{ color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={20} /> <span>Itens no Banco Neon</span>
          </div>
          <h2 style={{ fontSize: '50px', margin: '10px 0', color: '#222' }}>{items.length}</h2>
          <p style={{ color: '#4caf50', fontSize: '14px' }}>● Conectado ao Fly.io</p>
        </div>

        {/* Formulário de Cadastro */}
        <div style={{ background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', flex: '1 1 300px' }}>
          <h3 style={{ margin: '0 0 15px 0' }}>Cadastrar Novo</h3>
          <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nome do item..."
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
            <button type="submit" style={{ background: '#646cff', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <PlusCircle size={18} /> Adicionar
            </button>
          </form>
        </div>

        {/* Gráfico */}
        <div style={{ background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', flex: '1 1 100%' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#444' }}>Volume em Estoque</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={[{name: 'Estoque', total: items.length}]}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#646cff" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default App;