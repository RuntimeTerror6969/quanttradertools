'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get, update } from 'firebase/database';
import { auth, database } from '@/lib/firebase';
import toast from 'react-hot-toast';
import { UserData, MT5Account, Subscription } from '@/types/user';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

export default function Subscriptions() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingAccount, setEditingAccount] = useState<{
    subscriptionIndex: number;
    accountIndex: number;
    account: MT5Account;
  } | null>(null);
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
          const subscribers = snapshot.val() as Record<string, UserData>;
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

  const handleEditAccount = (subscriptionIndex: number, accountIndex: number, account: MT5Account) => {
    setEditingAccount({ subscriptionIndex, accountIndex, account });
  };

  const handleSaveAccount = async () => {
    if (!editingAccount || !userData) return;

    const { subscriptionIndex, accountIndex, account } = editingAccount;
    const updatedUserData = { ...userData };
    const subscription = updatedUserData.subscription[subscriptionIndex];

    if (!Array.isArray(subscription.mt5_accounts)) {
      subscription.mt5_accounts = [subscription.mt5_accounts];
    }
    subscription.mt5_accounts[accountIndex] = account;

    try {
      const userRef = ref(database, `subscriberDetails/${userData.mobileNumber}`);
      await update(userRef, {
        subscription: updatedUserData.subscription
      });
      setUserData(updatedUserData);
      setEditingAccount(null);
      toast.success('MT5 account details updated successfully');
    } catch (error: unknown) {
      console.error('Error updating MT5 account:', error);
      toast.error('Failed to update MT5 account details');
    }
  };

  const handleAddAccount = async (subscriptionIndex: number) => {
    if (!userData) return;
    
    const subscription = userData.subscription[subscriptionIndex];
    const newAccount: MT5Account = {
      accountNr: 0,
      server: ''
    };

    const updatedUserData = { ...userData };
    if (Array.isArray(subscription.mt5_accounts)) {
      updatedUserData.subscription[subscriptionIndex].mt5_accounts = [
        ...subscription.mt5_accounts,
        newAccount
      ];
    } else {
      updatedUserData.subscription[subscriptionIndex].mt5_accounts = [
        subscription.mt5_accounts,
        newAccount
      ];
    }

    try {
      const userRef = ref(database, `subscriberDetails/${userData.mobileNumber}`);
      await update(userRef, {
        subscription: updatedUserData.subscription
      });
      setUserData(updatedUserData);
      const newAccountIndex = Array.isArray(subscription.mt5_accounts) ? 
        subscription.mt5_accounts.length : 1;
      handleEditAccount(subscriptionIndex, newAccountIndex, newAccount);
      toast.success('New MT5 account added');
    } catch (error: unknown) {
      console.error('Error adding MT5 account:', error);
      toast.error('Failed to add new MT5 account');
    }
  };

  const isSubscriptionActive = (expirationDate: string) => {
    if (!expirationDate) return true; // Lifetime subscription
    const expDate = new Date(expirationDate);
    const today = new Date();
    return expDate > today;
  };

  const getSubscriptionStatus = (subscription: Subscription) => {
    if (!subscription.expirationDate) {
      return {
        status: 'lifetime',
        label: 'Lifetime',
        className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      };
    }
    
    const isActive = isSubscriptionActive(subscription.expirationDate);
    return isActive ? {
      status: 'active',
      label: 'Active',
      className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    } : {
      status: 'expired',
      label: 'Expired',
      className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
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
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Subscriptions</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Manage your Quant Trader Tools subscriptions and MT5 accounts
            </p>
          </div>

          <div className="space-y-6">
            {userData?.subscription.map((sub, subIndex) => {
              const subscriptionStatus = getSubscriptionStatus(sub);
              const isExpired = subscriptionStatus.status === 'expired';

              return (
                <div 
                  key={sub.licenseKey} 
                  className={`bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg ${isExpired ? 'opacity-50' : ''}`}
                >
                  <div className="px-4 py-5 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                          {sub.productType}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {sub.subscriptionType.charAt(0).toUpperCase() + sub.subscriptionType.slice(1)} Subscription
                        </p>
                      </div>
                      <div className="flex-shrink-0 -ml-10">
                        {(() => {
                          const type = sub.productType.toLowerCase();
                          let lightSrc = "";
                          let darkSrc = "";
                          let altText = "";
                          if (type === "quantcopiermt5telegram") {
                            lightSrc = "/QCT_Logo_Light.svg";
                            darkSrc = "/QCT_Logo_Dark.svg";
                            altText = "Quant Copier MT5 Telegram Logo";
                            return (
                              <>
                                <Image src={lightSrc} alt={altText} className="block dark:hidden h-24" width={300} height={96} />
                                <Image src={darkSrc} alt={altText} className="hidden dark:block h-24" width={300} height={96} />
                              </>
                            );
                          } else if (type === "quantcopiermt5discord") {
                            lightSrc = "/QCD_Logo_Light.svg";
                            darkSrc = "/QCD_Logo_Dark.svg";
                            altText = "Quant Copier MT5 Discord Logo";
                            return (
                              <>
                                <Image src={lightSrc} alt={altText} className="block dark:hidden h-12" width={150} height={48} />
                                <Image src={darkSrc} alt={altText} className="hidden dark:block h-12" width={150} height={48} />
                              </>
                            );
                          } else if (type.includes("messagecopier")) {
                            if (type.includes("discord")) {
                              lightSrc = "/MessageCopierDiscord_Logo_Light.svg";
                              darkSrc = "/MessageCopierDiscord_Logo_Dark.svg";
                              altText = "Message Copier Discord Logo";
                              return (
                                <>
                                  <Image src={lightSrc} alt={altText} className="block dark:hidden h-12" width={150} height={48} />
                                  <Image src={darkSrc} alt={altText} className="hidden dark:block h-12" width={150} height={48} />
                                </>
                              );
                            } else if (type.includes("telegram")) {
                              lightSrc = "/MessageCopierTelegram_Logo_Light.svg";
                              darkSrc = "/MessageCopierTelegram_Logo_Dark.svg";
                              altText = "Message Copier Telegram Logo";
                              return (
                                <>
                                  <Image src={lightSrc} alt={altText} className="block dark:hidden h-24" width={300} height={96} />
                                  <Image src={darkSrc} alt={altText} className="hidden dark:block h-24" width={300} height={96} />
                                </>
                              );
                            }
                          }
                          return null;
                        })()}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className={`px-3 py-1 text-sm rounded-full ${subscriptionStatus.className}`}>
                          {subscriptionStatus.label}
                        </span>
                        {isExpired && (
                          <button className="ml-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                            Renew Subscription
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={`border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6 ${isExpired ? 'opacity-50' : ''}`}>
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="text-left text-sm font-bold text-gray-500 dark:text-gray-400 pb-3">License Key</th>
                          <th className="text-left text-sm font-bold text-gray-500 dark:text-gray-400 pb-3">Subscription Date</th>
                          <th className="text-left text-sm font-bold text-gray-500 dark:text-gray-400 pb-3">Expiration Date</th>
                          <th className="text-right text-sm font-bold text-gray-500 dark:text-gray-400 pb-3">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-sm text-gray-900 dark:text-white pr-4">{sub.licenseKey}</td>
                          <td className="text-sm text-gray-900 dark:text-white pr-4">
                            {new Date(sub.subscriptionDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              timeZone: 'Asia/Kolkata'
                            })}
                          </td>
                          <td className="text-sm text-gray-900 dark:text-white pr-4">
                            {sub.expirationDate ? new Date(sub.expirationDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              timeZone: 'Asia/Kolkata'
                            }) : 'Lifetime'}
                          </td>
                          <td className="text-sm text-gray-900 dark:text-white text-right">${sub.subscriptionPrice}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className={`border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6 ${isExpired ? 'opacity-50' : ''}`}>
                    <div className="mb-4 flex justify-between items-center">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        MT5 Accounts ({Array.isArray(sub.mt5_accounts) ? sub.mt5_accounts.length : 1} of {sub.number_of_license})
                      </h4>
                      {!isExpired && ((Array.isArray(sub.mt5_accounts) ? sub.mt5_accounts.length : 1) < sub.number_of_license) && (
                        <button
                          onClick={() => handleAddAccount(subIndex)}
                          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          + Add MT5 Account
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {(Array.isArray(sub.mt5_accounts) ? sub.mt5_accounts : [sub.mt5_accounts]).map((account, accIndex) => (
                        <div key={`${account.accountNr}-${accIndex}`} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          {editingAccount?.subscriptionIndex === subIndex && editingAccount?.accountIndex === accIndex ? (
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Account Number</label>
                                <input
                                  type="number"
                                  value={editingAccount.account.accountNr}
                                  onChange={(e) => setEditingAccount({
                                    ...editingAccount,
                                    account: { ...editingAccount.account, accountNr: parseInt(e.target.value) }
                                  })}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white sm:text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Server</label>
                                <input
                                  type="text"
                                  value={editingAccount.account.server}
                                  onChange={(e) => setEditingAccount({
                                    ...editingAccount,
                                    account: { ...editingAccount.account, server: e.target.value }
                                  })}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white sm:text-sm"
                                />
                              </div>
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={handleSaveAccount}
                                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingAccount(null)}
                                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  Account: {account.accountNr}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Server: {account.server}
                                </p>
                              </div>
                              {!isExpired && (
                                <button
                                  onClick={() => handleEditAccount(subIndex, accIndex, { ...account })}
                                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                  Edit
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 