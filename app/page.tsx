"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchData as fetchApiData,
  addData,
  updateData,
  deleteData,
} from "./lib/api";
import {
  Plus,
  Edit,
  Trash,
  ExternalLink,
  Moon,
  Sun,
  Menu,
  X,
  Database,
} from "lucide-react";

interface DataItem {
  Codes: string;
  UrlName: string;
  ColorId: string;
}

export default function Home() {
  const [data, setData] = useState<DataItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<DataItem | null>(null);
  const [formData, setFormData] = useState({
    Codes: "",
    UrlName: "",
    ColorId: "#22c55e",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    loadData();
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
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
    } finally {
      setIsLoading(false);
    }
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
      setFormData({ Codes: "", UrlName: "", ColorId: "#22c55e" });
      loadData();
      toast.success("Item added successfully");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentItem) return;
    setIsLoading(true);
    try {
      await updateData(currentItem.Codes, currentItem);
      setIsModalOpen(false);
      loadData();
      toast.success("Item updated successfully");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (code: string) => {
    setIsLoading(true);
    try {
      await deleteData(code);
      loadData();
      toast.success("Item deleted successfully");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
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
    const urlName = item.UrlName.replace(/\s+/g, "");
    return `https://us-now-sh.vercel.app/${urlName}?groupid=${item.Codes}`;
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0b0b0b] dark:to-[#141414] text-gray-800 dark:text-gray-100 font-cairo transition-all duration-500">
      <ToastContainer theme={isDarkMode ? "dark" : "light"} />

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64 bg-white/70 dark:bg-[#111]/60 backdrop-blur-xl border-r border-gray-200/30 dark:border-gray-700/30 p-6 fixed md:relative z-20 transition-transform duration-300`}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Database size={22} className="text-green-500" /> Admin
          </h1>
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X size={18} />
          </button>
        </div>
        <nav>
          <button
            onClick={() => setIsModalOpen(false)}
            className="flex items-center gap-3 w-full px-4 py-3 mb-3 text-lg rounded-xl bg-gradient-to-r from-green-500/80 to-green-600/80 text-white hover:scale-[1.02] transition-transform shadow-lg"
          >
            <Plus size={20} /> Add New
          </button>
        </nav>
        <div className="mt-auto pt-6 border-t border-gray-200/30 dark:border-gray-700/30">
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-3 px-4 py-2 w-full rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 space-y-12 transition-all duration-500">
        {/* Top Bar (Mobile) */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <Menu size={20} />
          </button>
          <h1 className="font-bold text-xl">Admin Panel</h1>
        </div>

        {/* Add Form Card */}
        <section className="bg-white/80 dark:bg-[#111]/70 backdrop-blur-lg border border-gray-200/20 dark:border-gray-700/30 rounded-3xl p-8 shadow-xl transition-all hover:shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Plus size={22} /> Add New Code
          </h2>
          <form
            onSubmit={handleAdd}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center"
          >
            <input
              type="text"
              name="Codes"
              placeholder="Enter new code"
              value={formData.Codes}
              onChange={handleInputChange}
              className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition-all"
            />
            <input
              type="text"
              name="UrlName"
              placeholder="Enter URL name"
              value={formData.UrlName}
              onChange={handleInputChange}
              className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition-all"
            />
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">Color:</label>
              <input
                type="color"
                name="ColorId"
                value={formData.ColorId}
                onChange={handleInputChange}
                className="w-12 h-10 rounded-lg cursor-pointer border border-gray-300 dark:border-gray-700"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all"
            >
              Add Code
            </button>
          </form>
        </section>

        {/* Data Table */}
        <section className="bg-white/80 dark:bg-[#111]/70 backdrop-blur-lg border border-gray-200/20 dark:border-gray-700/30 rounded-3xl p-8 shadow-xl overflow-x-auto">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Manage Codes
          </h2>
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
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
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                >
                  <td className="p-4 font-medium">{item.Codes}</td>
                  <td className="p-4">{item.UrlName}</td>
                  <td className="p-4 flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-700"
                      style={{ backgroundColor: item.ColorId }}
                    ></div>
                    {item.ColorId}
                  </td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.Codes)}
                      className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
                    >
                      <Trash size={18} />
                    </button>
                    <a
                      href={generateLink(item)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition"
                    >
                      <ExternalLink size={18} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {/* Modal */}
      {isModalOpen && currentItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="bg-white dark:bg-[#111] p-8 rounded-2xl shadow-2xl border border-gray-200/30 dark:border-gray-700/30 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6">Edit Code</h2>
            <form onSubmit={handleEdit} className="space-y-5">
              <input
                type="text"
                name="Codes"
                value={currentItem.Codes}
                onChange={handleEditInputChange}
                className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 w-full border border-gray-300 dark:border-gray-700"
                readOnly
              />
              <input
                type="text"
                name="UrlName"
                value={currentItem.UrlName}
                onChange={handleEditInputChange}
                className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 w-full border border-gray-300 dark:border-gray-700"
              />
              <div className="flex items-center gap-3">
                <label>Color:</label>
                <input
                  type="color"
                  name="ColorId"
                  value={currentItem.ColorId}
                  onChange={handleEditInputChange}
                  className="w-12 h-10 rounded-lg border border-gray-300 dark:border-gray-700"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-6 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
          <div className="w-12 h-12 border-4 border-t-transparent border-green-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
