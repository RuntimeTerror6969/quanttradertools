import {NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

// Using the new Next.js 13+ API route handlers
export async function GET() {
  try {
    // Get all transactions from the collection
    const transactionsRef = collection(firestore, 'Transactions');
    const querySnapshot = await getDocs(transactionsRef);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { message: 'No transactions found' },
        { status: 404 }
      );
    }

    // Convert the documents to an array of data
    const transactions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(transactions, { status: 200 });

  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 