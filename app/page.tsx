"use client";
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchData as fetchApiData, addData, updateData, deleteData } from './lib/api';
import { Plus, Edit, Trash, ExternalLink, Moon, Sun, Menu, X } from 'lucide-react';

interface DataItem {
  Codes: string;
  UrlName: string;
  ColorId: string;
}

export default function Home() {
  const [data, setData] = useState<DataItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<DataItem | null>(null);
  const [formData, setFormData] = useState({ Codes: '', UrlName: '', ColorId: '#4f46e5' });
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    loadData();
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDarkMode);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
    if (!formData.Codes || !formData.UrlName) return toast.warn("Fill all fields");
    setIsLoading(true);
    try {
      await addData(formData);
      setFormData({ Codes: '', UrlName: '', ColorId: '#4f46e5' });
      loadData();
      toast.success("Added successfully");
    } catch (error) {
      toast.error((error as Error).message);
    }
    setIsLoading(false);
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentItem) return;
    setIsLoading(true);
    try {
      await updateData(currentItem.Codes, currentItem);
      setIsModalOpen(false);
      loadData();
      toast.success("Updated successfully");
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
      toast.success("Deleted successfully");
    } catch (error) {
      toast.error((error as Error).message);
    }
    setIsLoading(false);
  };

  const openEditModal = (item: DataItem) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const generateLink = (item: DataItem) =>
    `https://us-now-sh.vercel.app/${item.UrlName.replace(/\s+/g, '')}?groupid=${item.Codes}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-950 text-gray-800 dark:text-gray-200 transition-colors">
      <ToastContainer theme={isDarkMode ? 'dark' : 'light'} />

      {/* Loader */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="loader"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className="flex">
        <aside
          className={`fixed md:static top-0 left-0 h-full w-64 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg shadow-lg p-6 flex flex-col justify-between transform transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div>
            <h1 className="text-2xl font-bold mb-8 text-indigo-600 dark:text-indigo-400">Admin Panel</h1>
            <nav className="space-y-2">
              <button
                onClick={() => document.getElementById('add-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center w-full gap-3 px-4 py-3 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-all"
              >
                <Plus size={18} /> Add New
              </button>
            </nav>
          </div>
          <button
            onClick={toggleDarkMode}
            className="mt-8 flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />} {isDarkMode ? 'Light' : 'Dark'} Mode
          </button>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-10 space-y-10">
          {/* Mobile menu button */}
          <button
            onClick={toggleSidebar}
            className="md:hidden mb-6 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Add Form */}
          <section id="add-form" className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold mb-6 text-indigo-600 dark:text-indigo-400">Add New Code</h2>
            <form onSubmit={handleAdd} className="grid md:grid-cols-4 gap-6">
              <input
                type="text"
                name="Codes"
                placeholder="Enter code"
                value={formData.Codes}
                onChange={handleInputChange}
                className="input"
              />
              <input
                type="text"
                name="UrlName"
                placeholder="Enter URL name"
                value={formData.UrlName}
                onChange={handleInputChange}
                className="input"
              />
              <div className="flex items-center gap-3">
                <label className="font-medium">Color:</label>
                <input
                  type="color"
                  name="ColorId"
                  value={formData.ColorId}
                  onChange={handleInputChange}
                  className="w-10 h-10 rounded-lg border"
                />
              </div>
              <button
                type="submit"
                className="btn-primary"
              >
                Add Code
              </button>
            </form>
          </section>

          {/* Table */}
          <section className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold mb-6 text-indigo-600 dark:text-indigo-400">Manage Codes</h2>
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full border-collapse text-sm md:text-base">
                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  <tr>
                    <th className="p-4 text-left">Code</th>
                    <th className="p-4 text-left">URL Name</th>
                    <th className="p-4 text-left">Color</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
                    >
                      <td className="p-4">{item.Codes}</td>
                      <td className="p-4">{item.UrlName}</td>
                      <td className="p-4 flex items-center gap-3">
                        <span
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: item.ColorId }}
                        ></span>
                        {item.ColorId}
                      </td>
                      <td className="p-4 flex gap-2">
                        <button onClick={() => openEditModal(item)} className="btn-yellow"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(item.Codes)} className="btn-red"><Trash size={16} /></button>
                        <a href={generateLink(item)} target="_blank" rel="noopener noreferrer" className="btn-green">
                          <ExternalLink size={16} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {/* Edit Modal */}
      {isModalOpen && currentItem && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-md space-y-6">
            <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">Edit Code</h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <input
                type="text"
                name="Codes"
                value={currentItem.Codes}
                readOnly
                className="input bg-gray-100 dark:bg-gray-700"
              />
              <input
                type="text"
                name="UrlName"
                value={currentItem.UrlName}
                onChange={handleEditInputChange}
                className="input"
              />
              <div className="flex items-center gap-3">
                <label>Color:</label>
                <input
                  type="color"
                  name="ColorId"
                  value={currentItem.ColorId}
                  onChange={handleEditInputChange}
                  className="w-10 h-10 rounded-lg border"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-gray">Cancel</button>
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
