import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [currentCode, setCurrentCode] = useState('');
  const [currentDescription, setCurrentDescription] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch('/api/data');
    const result = await response.json();
    setData(result);
  };

  const handleAdd = async () => {
    await fetch('/api/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: newCode, description: newDescription }),
    });
    setNewCode('');
    setNewDescription('');
    fetchData();
  };

  const handleEdit = async () => {
    await fetch('/api/edit', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index: currentIndex, code: currentCode, description: currentDescription }),
    });
    setIsEditing(false);
    setCurrentIndex(null);
    setCurrentCode('');
    setCurrentDescription('');
    fetchData();
  };

  const handleDelete = async (index) => {
    await fetch('/api/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index }),
    });
    fetchData();
  };

  const openEditModal = (item, index) => {
    setIsEditing(true);
    setCurrentIndex(index);
    setCurrentCode(item.code);
    setCurrentDescription(item.description);
  };

  const closeEditModal = () => {
    setIsEditing(false);
    setCurrentIndex(null);
    setCurrentCode('');
    setCurrentDescription('');
  };

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <div className="card">
        <div className="card-header">
          <h2>Add New Code</h2>
        </div>
        <div className="card-body">
          <input
            type="text"
            placeholder="Code"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <button onClick={handleAdd}>Add</button>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h2>Codes</h2>
          <button onClick={() => window.open('/api/data', '_blank')}>View JSON</button>
        </div>
        <div className="card-body">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.code}</td>
                  <td>{item.description}</td>
                  <td>
                    <button onClick={() => openEditModal(item, index)}>Edit</button>
                    <button onClick={() => handleDelete(index)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isEditing && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Code</h2>
            <input
              type="text"
              value={currentCode}
              onChange={(e) => setCurrentCode(e.target.value)}
            />
            <input
              type="text"
              value={currentDescription}
              onChange={(e) => setCurrentDescription(e.target.value)}
            />
            <button onClick={handleEdit}>Save</button>
            <button onClick={closeEditModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
