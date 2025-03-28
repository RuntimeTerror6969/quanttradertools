'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get, remove } from 'firebase/database';
import { auth, database } from '@/lib/firebase';
import toast from 'react-hot-toast';
import { UserData, SubscriberData } from '@/types/user';
import Navbar from '@/components/Navbar';

export default function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/');
        return;
      }

      try {
        const usersRef = ref(database, 'subscriberDetails');
        const snapshot = await get(usersRef);
        
        if (snapshot.exists()) {
          const subscribers = snapshot.val() as Record<string, SubscriberData>;
          const entry = Object.entries(subscribers).find(([, data]) => data.email === user.email);
          
          if (entry) {
            const [mobileNumber, details] = entry;
            setUserData({
              ...details,
              mobileNumber
            });
          } else {
            toast.error('No data found for this account');
            return;
          }
        }
      } catch (error: unknown) {
        console.error('Error fetching user data:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleDeleteAccount = async () => {
    if (!userData) return;

    // Show confirmation dialog
    const isConfirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    if (!isConfirmed) return;

    try {
      // Delete user data from realtime database
      const userRef = ref(database, `subscriberDetails/${userData.mobileNumber}`);
      await remove(userRef);

      // Sign out the user
      await auth.signOut();
      
      toast.success('Account deleted successfully');
      router.push('/');
    } catch (error: unknown) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar onSignOut={() => auth.signOut().then(() => router.push('/'))} />
      
      {/* Main Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" style={{ fontFamily: 'system-ui, sans-serif' }}>
                User Profile
              </h3>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700">
              <dl>
                <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Full name</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                    {`${userData.firstName} ${userData.lastName}`.trim()}
                  </dd>
                </div>
                <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email address</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                    {userData.email}
                  </dd>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Mobile number</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                    {userData.mobileNumber}
                  </dd>
                </div>
              </dl>
              <div className="px-4 py-5 sm:px-6">
                <button
                  onClick={handleDeleteAccount}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 