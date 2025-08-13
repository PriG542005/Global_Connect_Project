"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col ">
      {/* Navbar */}
      <header className="w-full px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold text-blue-700">Global Connect</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Your Global Network Begins Here
        </h2>
        <p className="text-lg text-gray-600 max-w-xl">
          Connect with professionals worldwide, unlock opportunities, and grow your career with Global Connect.
        </p>
        <button
          onClick={handleGetStarted}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Get Started
        </button>
      </section>

      {/* Features */}
      <section className="bg-gray-50 px-6 md:px-16 py-16 text-center">
        <h3 className="text-3xl font-bold mb-10">What You Can Do</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-6 rounded shadow hover:shadow-lg">
            <h4 className="text-xl font-semibold mb-2">Connect</h4>
            <p className="text-gray-600">Expand your network with professionals around the globe.</p>
          </div>
          <div className="bg-white p-6 rounded shadow hover:shadow-lg">
            <h4 className="text-xl font-semibold mb-2">Explore</h4>
            <p className="text-gray-600">Find your dream job or next big collaboration.</p>
          </div>
          <div className="bg-white p-6 rounded shadow hover:shadow-lg">
            <h4 className="text-xl font-semibold mb-2">Grow</h4>
            <p className="text-gray-600">Enhance your skills through shared knowledge and resources.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 md:px-16 py-16">
        <h3 className="text-3xl font-bold text-center mb-10">Why People Love Global Connect</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            ["I found my remote job through Global Connect within a week!", "Aanya R., UI Designer"],
            ["The best way to build international connections without limits.", "Omar F., HR Consultant"],
            ["I gained amazing freelance projects by networking here.", "Lina M., Marketing Strategist"],
            ["It’s more than a platform, it’s a career catalyst.", "Raj S., Data Analyst"],
          ].map(([quote, name], idx) => (
            <div key={idx} className="bg-blue-50 p-5 rounded-lg shadow">
              <p className="text-gray-700 italic">“{quote}”</p>
              <div className="mt-4 text-sm font-semibold text-blue-800">— {name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto text-sm text-center text-gray-500 py-6 border-t">
        © {new Date().getFullYear()} Global Connect. All rights reserved.
      </footer>
    </div>
  );
}
