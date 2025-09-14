import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: ''
  });

  // Load products
  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle Add or Update
  const handleSaveProduct = (e) => {
    e.preventDefault();
    const url = editingId 
      ? `http://localhost:5000/products/${editingId}` 
      : 'http://localhost:5000/products';
    const method = editingId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(savedProduct => {
      if (editingId) {
        setProducts(products.map(p => p.id === editingId ? savedProduct : p));
      } else {
        setProducts([...products, savedProduct]);
      }
      resetForm();
    });
  };

  // Start editing
  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      quantity: product.quantity
    });
    setShowForm(true);
  };

  // Delete product
  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    fetch(`http://localhost:5000/products/${id}`, { method: 'DELETE' })
      .then(() => setProducts(products.filter(p => p.id !== id)));
  };

  // Reset form
  const resetForm = () => {
    setFormData({ name: '', description: '', category: '', price: '', quantity: '' });
    setEditingId(null);
    setShowForm(false);
  };

  // Render content
  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        const lowStock = products.filter(p => p.quantity < 10).length;
        const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
        return (
          <div className="content">
            <h1>📊 Dashboard</h1>
            <div className="stats">
              <div>Total Products: {products.length}</div>
              <div>Low Stock: {lowStock}</div>
              <div>Inventory Value: R{totalValue.toFixed(2)}</div>
            </div>
          </div>
        );
      case 'inventory':
        return (
          <div className="content">
            <h1>📦 Inventory</h1>
            <button onClick={() => { setEditingId(null); setShowForm(true); }} className="btn-add">➕ Add Product</button>

            {showForm && (
              <div className="form-overlay">
                <div className="form">
                  <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                  <form onSubmit={handleSaveProduct}>
                    <input name="name" placeholder="Product Name" value={formData.name} onChange={handleInputChange} required />
                    <input name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} required />
                    <input name="category" placeholder="Category" value={formData.category} onChange={handleInputChange} required />
                    <input name="price" type="number" step="0.01" placeholder="Price" value={formData.price} onChange={handleInputChange} required />
                    <input name="quantity" type="number" placeholder="Quantity" value={formData.quantity} onChange={handleInputChange} required />
                    <div>
                      <button type="submit">{editingId ? 'Update' : 'Save'}</button>
                      <button type="button" onClick={resetForm}>Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>R{p.price}</td>
                    <td>{p.quantity} {p.quantity < 10 && <span className="low">⚠️</span>}</td>
                    <td>
                      <button onClick={() => handleEdit(p)} className="btn-edit">✏️</button>
                      <button onClick={() => handleDelete(p.id)} className="btn-delete">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'sales':
        return <div className="content"><h1> Sales Module</h1><p>Coming Soon</p></div>;
      case 'customer':
        return <div className="content"><h1> Customer Module</h1><p>Coming Soon</p></div>;
      case 'reporting':
        return <div className="content"><h1> Reporting Module</h1><p>Coming Soon</p></div>;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <div className="sidebar">
        <h2>WingsDash</h2>
        <button onClick={() => setCurrentView('dashboard')}>Dashboard</button>
        <button onClick={() => setCurrentView('inventory')}>Inventory</button>
        <button onClick={() => setCurrentView('sales')}>Sales</button>
        <button onClick={() => setCurrentView('customer')}>Customer</button>
        <button onClick={() => setCurrentView('reporting')}>Reporting</button>
      </div>
      <div className="main">{renderContent()}</div>
    </div>
  );
}

export default App;