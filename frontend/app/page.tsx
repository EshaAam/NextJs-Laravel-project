import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Hero Section */}
      <section className="bg-gray-200 text-white text-center py-2">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">Welcome guys</h1>
          <p className="text-lg md:text-xl mb-6 text-black">Build amazing things with Next.js & Tailwind CSS</p>
          <Link href="/auth" className="bg-stone-100 text-black px-6 py-1 rounded-lg shadow-lg  transition">
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 text-center my-4 flex-grow">
        <h2 className="text-3xl font-bold mb-8 text-black">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg shadow hover:shadow-lg transition">
            <Image src="/file.svg" alt="Feature 1" width={60} height={60} className="mx-auto" />
            <h4 className="text-xl font-semibold mt-4 text-black">Fast Performance</h4>
            <p className="mt-2 text-gray-600">Optimized for speed and efficiency.</p>
          </div>
          <div className="p-6 border rounded-lg shadow hover:shadow-lg transition">
            <Image src="/window.svg" alt="Feature 2" width={60} height={60} className="mx-auto" />
            <h4 className="text-xl font-semibold mt-4 text-black">User Friendly</h4>
            <p className="mt-2 text-gray-600">Intuitive and easy-to-use design.</p>
          </div>
          <div className="p-6 border rounded-lg shadow hover:shadow-lg transition">
            <Image src="/globe.svg" alt="Feature 3" width={60} height={60} className="mx-auto" />
            <h4 className="text-xl font-semibold mt-4 text-black">SEO Ready</h4>
            <p className="mt-2 text-gray-600">Boost your search rankings with SEO.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 text-center py-4">
        <p className="mb-0">© 2025 MyBrand. All rights reserved.</p>
      </footer>
    </div>

    
  );
}
