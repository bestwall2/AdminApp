import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbzfxNL3ZrnpwbgryyrRyvw-qpGwq7kd1TcdhMpvMoN_xaE7TJNK2uZaXQu6b33r_5e6/exec';

function GoogleSheetsApp() {
  const [codes, setCodes] = useState([]);
  const [newCode, setNewCode] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editRow, setEditRow] = useState(null);

  useEffect(() => {
    fetchCodes();
  }, []);

  // 1. Get All Codes
  const fetchCodes = async () => {
    const response = await fetch(`${API_BASE_URL}?func=get`);
    const data = await response.json();
    setCodes(data.data);
  };

  // 2. Add a New Code
  const handleAddCode = async () => {
    if (!newCode) return;
    await fetch(`${API_BASE_URL}?func=add&Codes=${newCode}`);
    setNewCode('');
    fetchCodes(); // Refresh the list
  };

  // 3. Edit a Code
  const handleEditCode = async () => {
    if (!editCode || !editRow) return;
    await fetch(`${API_BASE_URL}?func=edit&row=${editRow}&col=1&newValue=${editCode}`);
    setEditCode('');
    setEditRow(null);
    fetchCodes(); // Refresh the list
  };

  // 4. Delete a Code
  const handleDeleteCode = async (row) => {
    await fetch(`${API_BASE_URL}?func=delete&row=${row}`);
    fetchCodes(); // Refresh the list
  };

  return (
    <div>
      <h1>Google Sheets API Integration</h1>

      {/* Add Code Form */}
      <div>
        <h2>Add New Code</h2>
        <input
          type="text"
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
          placeholder="Enter new code"
        />
        <button onClick={handleAddCode}>Add Code</button>
      </div>

      {/* Edit Code Form */}
      {editRow && (
        <div>
          <h2>Edit Code (Row: {editRow})</h2>
          <input
            type="text"
            value={editCode}
            onChange={(e) => setEditCode(e.target.value)}
            placeholder="Enter new value"
          />
          <button onClick={handleEditCode}>Save</button>
          <button onClick={() => setEditRow(null)}>Cancel</button>
        </div>
      )}

      {/* Codes List */}
      <h2>Codes</h2>
      <table>
        <thead>
          <tr>
            <th>Row</th>
            <th>Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {codes.map((item) => (
            <tr key={item.row}>
              <td>{item.row}</td>
              <td>{item.Codes}</td>
              <td>
                <button onClick={() => { setEditRow(item.row); setEditCode(item.Codes); }}>Edit</button>
                <button onClick={() => handleDeleteCode(item.row)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GoogleSheetsApp;
