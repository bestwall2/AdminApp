"use client";

import { useState } from 'react';
import { Plus, Edit, Trash, Eye } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function UsersPage() {
  const { users, addUser, updateUser, deleteUser } = useUserStore();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({ id: 0, name: '', email: '', role: '' });

  const handleAddUser = () => {
    addUser({ ...newUser, id: Date.now() });
    setAddModalOpen(false);
    setNewUser({ id: 0, name: '', email: '', role: '' });
  };

  const handleUpdateUser = () => {
    if (currentUser) {
      updateUser(currentUser);
      setEditModalOpen(false);
      setCurrentUser(null);
    }
  };

  const openEditModal = (user: User) => {
    setCurrentUser(user);
    setEditModalOpen(true);
  };

  const openViewModal = (user: User) => {
    setCurrentUser(user);
    setViewModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
        <button
          onClick={() => setAddModalOpen(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="mr-2" /> Add User
        </button>
      </div>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className="flex space-x-2">
                  <button onClick={() => openViewModal(user)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <Eye />
                  </button>
                  <button onClick={() => openEditModal(user)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <Edit />
                  </button>
                  <button onClick={() => deleteUser(user.id)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <Trash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="card p-8 w-1/3">
            <h2 className="text-2xl font-bold mb-4">Add User</h2>
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              placeholder="Role"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
            />
            <div className="flex justify-end space-x-4">
              <button onClick={() => setAddModalOpen(false)} className="btn">
                Cancel
              </button>
              <button onClick={handleAddUser} className="btn btn-primary">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {currentUser && isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="card p-8 w-1/3">
            <h2 className="text-2xl font-bold mb-4">Edit User</h2>
            <input
              type="text"
              placeholder="Name"
              value={currentUser.name}
              onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={currentUser.email}
              onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              placeholder="Role"
              value={currentUser.role}
              onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
            />
            <div className="flex justify-end space-x-4">
              <button onClick={() => setEditModalOpen(false)} className="btn">
                Cancel
              </button>
              <button onClick={handleUpdateUser} className="btn btn-primary">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {currentUser && isViewModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="card p-8 w-1/3">
            <h2 className="text-2xl font-bold mb-4">{currentUser.name}</h2>
            <p><strong>Email:</strong> {currentUser.email}</p>
            <p><strong>Role:</strong> {currentUser.role}</p>
            <div className="flex justify-end mt-4">
              <button onClick={() => setViewModalOpen(false)} className="btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
