"use client";

import { Home, Users, Settings, BarChart, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const links = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/users', icon: Users, label: 'Users' },
  { href: '/settings', icon: Settings, label: 'Settings' },
  { href: '/reports', icon: BarChart, label: 'Reports' },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-20"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </button>
      <aside
        className={`w-64 h-screen bg-card-light dark:bg-card-dark p-4 fixed md:static transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-10`}
      >
        <div className="flex items-center mb-8">
          <h1 className="text-2xl font-bold">Admin</h1>
        </div>
        <nav>
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center p-2 rounded-lg ${
                    pathname === link.href
                      ? 'bg-primary-light text-white dark:bg-primary-dark'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <link.icon className="mr-3" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};
