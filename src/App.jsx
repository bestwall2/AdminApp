import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbzfxNL3ZrnpwbgryyrRyvw-qpGwq7kd1TcdhMpvMoN_xaE7TJNK2uZaXQu6b33r_5e6/exec';

function App() {
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [currentCode, setCurrentCode] = useState('');
  const [currentUrlName, setCurrentUrlName] = useState('');
  const [currentColorId, setCurrentColorId] = useState('#ffffff');
  const [newCode, setNewCode] = useState('');
  const [newUrlName, setNewUrlName] = useState('');
  const [newColorId, setNewColorId] = useState('#ffffff');
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
    if (!newCode || !newUrlName) return;
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        func: 'add',
        Codes: newCode,
        UrlName: newUrlName,
        ColorId: newColorId,
      });
      await fetch(`${API_BASE_URL}?${params.toString()}`);
      setNewCode('');
      setNewUrlName('');
      setNewColorId('#ffffff');
      fetchData();
    } catch (error) {
      console.error("Error adding data:", error);
    }
    setIsLoading(false);
  };

  const handleEdit = async () => {
    if (currentIndex === null) return;
    setIsLoading(true);

    const originalItem = data.find(item => item.row === currentIndex);
    const editPromises = [];

    if (originalItem.Codes !== currentCode) {
      const params = new URLSearchParams({
        func: 'edit',
        row: currentIndex,
        col: 1,
        newValue: currentCode,
      });
      editPromises.push(fetch(`${API_BASE_URL}?${params.toString()}`));
    }
    if (originalItem.UrlName !== currentUrlName) {
      const params = new URLSearchParams({
        func: 'edit',
        row: currentIndex,
        col: 2,
        newValue: currentUrlName,
      });
      editPromises.push(fetch(`${API_BASE_URL}?${params.toString()}`));
    }
    if (originalItem.ColorId !== currentColorId) {
      const params = new URLSearchParams({
        func: 'edit',
        row: currentIndex,
        col: 3,
        newValue: currentColorId,
      });
      editPromises.push(fetch(`${API_BASE_URL}?${params.toString()}`));
    }

    try {
      await Promise.all(editPromises);
      setIsEditing(false);
      setCurrentIndex(null);
      setCurrentCode('');
      setCurrentUrlName('');
      setCurrentColorId('#ffffff');
      fetchData();
    } catch (error){
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
  const handleLink = async (item) => {
  try {
    // Builds the dynamic link using data from the current row
    const url = `https://us-now.vercel.app/${item.UrlName}?groupid=${item.Codes}`;
    // Optional: open it in a new tab
    window.open(url, '_blank');
  } catch (error) {
    console.error("Error creating link:", error);
  }
  };

  const openEditModal = (item) => {
    setIsEditing(true);
    setCurrentIndex(item.row);
    setCurrentCode(item.Codes);
    setCurrentUrlName(item.UrlName);
    setCurrentColorId(item.ColorId);
  };

  const closeEditModal = () => {
    setIsEditing(false);
    setCurrentIndex(null);
    setCurrentCode('');
    setCurrentUrlName('');
    setCurrentColorId('#ffffff');
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
            <input
              type="text"
              placeholder="Enter URL name"
              value={newUrlName}
              onChange={(e) => setNewUrlName(e.target.value)}
            />
            <div className="color-picker-wrapper">
              <label htmlFor="color-picker">Color ID:</label>
              <input
                id="color-picker"
                type="color"
                value={newColorId}
                onChange={(e) => setNewColorId(e.target.value)}
              />
              <span>{newColorId}</span>
            </div>
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
                  <th>URL Name</th>
                  <th>Color</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.row}>
                    <td>{item.Codes}</td>
                    <td>{item.UrlName}</td>
                    <td>
                      <div className="color-swatch" style={{ backgroundColor: item.ColorId }}></div>
                      {item.ColorId}
                    </td>
                    <td className="actions">
                      <button className="edit-btn" onClick={() => openEditModal(item)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(item.row)}>Delete</button>
                      <button className="link-btn" onClick={() => handleLink(item)}>Link</button>
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
            <input
              type="text"
              value={currentUrlName}
              onChange={(e) => setCurrentUrlName(e.target.value)}
            />
            <div className="color-picker-wrapper">
              <label htmlFor="edit-color-picker">Color ID:</label>
              <input
                id="edit-color-picker"
                type="color"
                value={currentColorId}
                onChange={(e) => setCurrentColorId(e.target.value)}
              />
              <span>{currentColorId}</span>
            </div>
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
