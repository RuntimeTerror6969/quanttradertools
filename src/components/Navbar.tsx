'use client';

import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMoon, FiSun } from 'react-icons/fi';

interface NavbarProps {
  onSignOut: () => void;
}

export default function Navbar({ onSignOut }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="bg-white dark:bg-gray-800 shadow transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <Image
                src="https://quanttradertools.github.io/logo.svg"
                alt="Quant Trader Tools Logo"
                width={40}
                height={40}
              />
              <span className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-200" style={{ fontFamily: 'Mokoto' }}>
                QUANT TRADER TOOLS
              </span>
            </Link>
            <nav className="hidden md:flex space-x-4">
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive('/dashboard')
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Profile
              </Link>
              <Link
                href="/dashboard/subscriptions"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive('/dashboard/subscriptions')
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Subscriptions
              </Link>
              <Link
                href="/dashboard/transactions"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive('/dashboard/transactions')
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Transactions
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
            </button>
            <button
              onClick={onSignOut}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors duration-200"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 