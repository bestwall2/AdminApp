"use client";
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchData as fetchApiData, addData, updateData, deleteData } from './lib/api';
import { Plus, Edit, Trash, ExternalLink } from 'lucide-react';

interface DataItem {
  Codes: string;
  UrlName: string;
  ColorId: string;
}

export default function Home() {
  const [data, setData] = useState<DataItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<DataItem | null>(null);
  const [formData, setFormData] = useState({ Codes: '', UrlName: '', ColorId: '#ffffff' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const result = await fetchApiData();
      setData(result);
    } catch (error) {
      toast.error((error as Error).message);
    }
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentItem) return;
    const { name, value } = e.target;
    setCurrentItem({ ...currentItem, [name]: value });
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.Codes || !formData.UrlName) {
      toast.warn("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    try {
      await addData(formData);
      setFormData({ Codes: '', UrlName: '', ColorId: '#ffffff' });
      loadData();
      toast.success("Item added successfully");
    } catch (error) {
      toast.error((error as Error).message);
    }
    setIsLoading(false);
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentItem || !currentItem.Codes || !currentItem.UrlName) {
      toast.warn("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    try {
      await updateData(currentItem.Codes, currentItem);
      setIsModalOpen(false);
      loadData();
      toast.success("Item updated successfully");
    } catch (error) {
      toast.error((error as Error).message);
    }
    setIsLoading(false);
  };

  const handleDelete = async (code: string) => {
    setIsLoading(true);
    try {
      await deleteData(code);
      loadData();
      toast.success("Item deleted successfully");
    } catch (error) {
      toast.error((error as Error).message);
    }
    setIsLoading(false);
  };

  const openEditModal = (item: DataItem) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  const generateLink = (item: DataItem) => {
    const urlName = item.UrlName.replace(/\s+/g, '');
    return `https://us-now-sh.vercel.app/${urlName}?groupid=${item.Codes}`;
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen font-cairo">
      <ToastContainer theme="dark" />
      {isLoading && <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center"><div className="loader"></div></div>}
      <div className="flex">
        <aside className="w-64 bg-white dark:bg-gray-800 p-8 shadow-lg">
          <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
          <nav>
            <ul>
              <li><a href="#" className="flex items-center gap-4 text-lg p-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"><Plus size={20} /> Add New Code</a></li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-12 fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-12">
            <h2 className="text-3xl font-bold mb-6">Add New Code</h2>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <input
                type="text"
                name="Codes"
                placeholder="Enter new code"
                value={formData.Codes}
                onChange={handleInputChange}
                className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="UrlName"
                placeholder="Enter URL name"
                value={formData.UrlName}
                onChange={handleInputChange}
                className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center gap-4">
                <label htmlFor="color-picker" className="text-lg">Color ID:</label>
                <input
                  id="color-picker"
                  type="color"
                  name="ColorId"
                  value={formData.ColorId}
                  onChange={handleInputChange}
                  className="w-16 h-10 rounded-lg"
                />
              </div>
              <button type="submit" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
                Add Code
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6">Manage Codes</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="p-4">Code</th>
                    <th className="p-4">URL Name</th>
                    <th className="p-4">Color</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
                      <td className="p-4">{item.Codes}</td>
                      <td className="p-4">{item.UrlName}</td>
                      <td className="p-4 flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full" style={{ backgroundColor: item.ColorId }}></div>
                        {item.ColorId}
                      </td>
                      <td className="p-4 flex gap-2">
                        <button onClick={() => openEditModal(item)} className="p-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white transition-all duration-300"><Edit size={20} /></button>
                        <button onClick={() => handleDelete(item.Codes)} className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all duration-300"><Trash size={20} /></button>
                        <a href={generateLink(item)} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-all duration-300"><ExternalLink size={20} /></a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {isModalOpen && currentItem && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center z-40">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-3xl font-bold mb-6">Edit Code</h2>
            <form onSubmit={handleEdit} className="grid grid-cols-1 gap-6">
              <input
                type="text"
                name="Codes"
                value={currentItem.Codes}
                onChange={handleEditInputChange}
                className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
                readOnly
              />
              <input
                type="text"
                name="UrlName"
                value={currentItem.UrlName}
                onChange={handleEditInputChange}
                className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
              />
              <div className="flex items-center gap-4">
                <label htmlFor="edit-color-picker" className="text-lg">Color ID:</label>
                <input
                  id="edit-color-picker"
                  type="color"
                  name="ColorId"
                  value={currentItem.ColorId}
                  onChange={handleEditInputChange}
                  className="w-16 h-10 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button type="submit" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">Save Changes</button>
                <button type="button" onClick={closeEditModal} className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-2 px-6 rounded-lg transition-all duration-300">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
