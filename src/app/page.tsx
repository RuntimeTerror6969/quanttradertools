import LoginForm from '@/components/LoginForm';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <Image
            src="https://quanttradertools.github.io/logo.svg"
            alt="Quant Trader Tools Logo"
            width={100}
            height={100}
            className="mb-4"
          />
          <h2 className="text-2xl font-mokoto text-gray-900 dark:text-white tracking-wider">
            Quant Trader Tools
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Login to access your dashboard
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
