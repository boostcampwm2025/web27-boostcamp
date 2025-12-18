import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SlideBDemo from './pages/slide-b-demo';

function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Vite + React + Tailwind
        </h1>
        <button
          onClick={() => setCount((count) => count + 1)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          count is {count}
        </button>
        <p className="mt-4 text-gray-600">Tailwind CSS v4 is working!</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/slide-b-demo" element={<SlideBDemo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
