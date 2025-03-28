import { auth } from './firebase';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const token = await user.getIdToken(true); // Force token refresh
    console.log('Token fetched successfully'); // Debug log

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }

    return response;
  } catch (error) {
    console.error('Error in fetchWithAuth:', error);
    throw error;
  }
} 