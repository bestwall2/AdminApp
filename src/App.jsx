import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
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
    } catch (error) {
      console.error("Error adding data:", error);
    }
    await fetchData();
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
    } catch (error) {
      console.error("Error editing data:", error);
    }
    await fetchData();
    setIsLoading(false);
  };

  const handleDelete = async (row) => {
    setIsLoading(true);
    try {
      await fetch(`${API_BASE_URL}?func=delete&row=${row}`);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
    await fetchData();
    setIsLoading(false);
  };

  const openEditModal = (item) => {
    setCurrentIndex(item.row);
    setCurrentCode(item.Codes);
    setCurrentUrlName(item.UrlName);
    setCurrentColorId(item.ColorId);
    setIsEditing(true);
  };

  const handleOpenLandingUrl = (item) => {
    const urlName = item.UrlName.replace(/\s/g, '');
    const url = `https://us-now.vercel.app/${urlName}?groupid=${item.Codes}`;
    window.open(url, '_blank');
  };

  return (
    <div className="container">
      {isLoading && <div className="loader"></div>}
      <header>
        <h1>لوحة تحكم المسؤول</h1>
      </header>
      <main>
        <div className="card add-card">
          <div className="card-header">
            <h2>إضافة كود جديد</h2>
          </div>
          <div className="card-body">
            <input
              type="text"
              placeholder="أدخل الكود الجديد"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
            />
            <input
              type="text"
              placeholder="أدخل اسم الرابط"
              value={newUrlName}
              onChange={(e) => setNewUrlName(e.target.value)}
            />
            <div className="color-picker-wrapper">
              <label htmlFor="color-picker">لون المعرف:</label>
              <input
                id="color-picker"
                type="color"
                value={newColorId}
                onChange={(e) => setNewColorId(e.target.value)}
              />
              <span>{newColorId}</span>
            </div>
            <button onClick={handleAdd}>إضافة الكود</button>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h2>إدارة الأكواد</h2>
          </div>
          <div className="card-body">
            <table>
              <thead>
                <tr>
                  <th>الكود</th>
                  <th>اسم الرابط</th>
                  <th>اللون</th>
                  <th>الإجراءات</th>
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
                      <button className="edit-btn" onClick={() => openEditModal(item)}>تعديل</button>
                      <button className="delete-btn" onClick={() => handleDelete(item.row)}>حذف</button>
                      <button className="link-btn" onClick={() => handleOpenLandingUrl(item)}>فتح الرابط</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Dialog.Root open={isEditing} onOpenChange={setIsEditing}>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <Dialog.Content className="DialogContent">
            <Dialog.Title className="DialogTitle">تعديل الكود (صف: {currentIndex})</Dialog.Title>
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
              <label htmlFor="edit-color-picker">لون المعرف:</label>
              <input
                id="edit-color-picker"
                type="color"
                value={currentColorId}
                onChange={(e) => setCurrentColorId(e.target.value)}
              />
              <span>{currentColorId}</span>
            </div>
            <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end', gap: '10px' }}>
              <Dialog.Close asChild>
                <button className="cancel-btn">إلغاء</button>
              </Dialog.Close>
              <button onClick={handleEdit}>حفظ التغييرات</button>
            </div>
            <Dialog.Close asChild>
              <button className="IconButton" aria-label="Close">
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

export default App;
