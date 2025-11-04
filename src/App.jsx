import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbzfxNL3ZrnpwbgryyrRyvw-qpGwq7kd1TcdhMpvMoN_xaE7TJNK2uZaXQu6b33r_5e6/exec';

function App() {
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [currentCode, setCurrentCode] = useState('');
  const [newCode, setNewCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}?func=get`);
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  const handleAdd = async () => {
    if (!newCode) return;
    setIsLoading(true);
    try {
      await fetch(`${API_BASE_URL}?func=add&Codes=${newCode}`);
      setNewCode('');
      fetchData();
    } catch (error) {
      console.error("Error adding data:", error);
    }
    setIsLoading(false);
  };

  const handleEdit = async () => {
    if (!currentCode || currentIndex === null) return;
    setIsLoading(true);
    try {
      await fetch(`${API_BASE_URL}?func=edit&row=${currentIndex}&col=1&newValue=${currentCode}`);
      setIsEditing(false);
      setCurrentIndex(null);
      setCurrentCode('');
      fetchData();
    } catch (error) {
      console.error("Error editing data:", error);
    }
    setIsLoading(false);
  };

  const handleDelete = async (row) => {
    setIsLoading(true);
    try {
      await fetch(`${API_BASE_URL}?func=delete&row=${row}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
    setIsLoading(false);
  };

  const openEditModal = (item) => {
    setIsEditing(true);
    setCurrentIndex(item.row);
    setCurrentCode(item.Codes);
  };

  const closeEditModal = () => {
    setIsEditing(false);
    setCurrentIndex(null);
    setCurrentCode('');
  };

  return (
    <div className="container">
      {isLoading && <div className="loader"></div>}
      <header>
        <h1>Admin Control Panel</h1>
      </header>
      <main>
        <div className="card add-card">
          <div className="card-header">
            <h2>Add New Code</h2>
          </div>
          <div className="card-body">
            <input
              type="text"
              placeholder="Enter new code"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
            />
            <button onClick={handleAdd}>Add Code</button>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h2>Manage Codes</h2>
          </div>
          <div className="card-body">
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.row}>
                    <td>{item.Codes}</td>
                    <td className="actions">
                      <button className="edit-btn" onClick={() => openEditModal(item)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(item.row)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      {isEditing && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Code (Row: {currentIndex})</h2>
            <input
              type="text"
              value={currentCode}
              onChange={(e) => setCurrentCode(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={handleEdit}>Save Changes</button>
              <button className="cancel-btn" onClick={closeEditModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
