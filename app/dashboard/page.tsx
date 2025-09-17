import Link from 'next/link';

export default function Dashboard() {
  return (
    <div>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-lg font-bold">
            <Link href="/dashboard">Ambulance Service</Link>
          </div>
          <div className="space-x-4">
            <Link href="/login" className="text-white hover:text-gray-300">Login</Link>
            <Link href="/signup" className="text-white hover:text-gray-300">Sign Up</Link>
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p>Welcome to the Ambulance Service dashboard.</p>
      </main>
    </div>
  );
}
