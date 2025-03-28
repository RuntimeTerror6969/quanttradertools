import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { adminAuth } from '@/lib/firebase-admin';

// Add these export configurations for Next.js
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Using the new Next.js 13+ API route handlers
export async function GET(request: NextRequest) {
  try {
    // Get the authorization token from the request header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    
    try {
      // Verify the token using admin SDK
      const decodedToken = await adminAuth.verifyIdToken(token);
      console.log('Authenticated user:', decodedToken.email);

      if (!decodedToken.email) {
        return NextResponse.json(
          { message: 'User email not found in token' },
          { status: 400 }
        );
      }

      // Use admin Firestore
      const db = getFirestore();
      
      // Use the proper Firestore Admin SDK syntax
      const snapshot = await db
        .collection('Transactions')
        .where('customerDetails.emailID', '==', decodedToken.email)
        .get();

      console.log('Query executed, found documents:', snapshot.size);

      if (snapshot.empty) {
        return NextResponse.json(
          { message: 'No transactions found for this user' },
          { status: 404 }
        );
      }

      const transactions = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?._seconds ? 
            new Date(data.createdAt._seconds * 1000).toISOString() : null,
          updatedAt: data.updatedAt?._seconds ? 
            new Date(data.updatedAt._seconds * 1000).toISOString() : null
        };
      });

      console.log('Processed transactions:', transactions.length);
      return NextResponse.json(transactions, { status: 200 });

    } catch (verifyError) {
      console.error('Token verification failed:', verifyError);
      return NextResponse.json(
        { 
          message: 'Invalid token', 
          error: verifyError instanceof Error ? verifyError.message : 'Unknown error' 
        },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { 
        message: 'Internal Server Error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 