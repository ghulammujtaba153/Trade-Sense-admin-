import React, { useState } from 'react';
import About from './About';
import Testimonials from './Testimonials';
import Terms from './Terms';

const Main = () => {
  const [activeTab, setActiveTab] = useState('about');

  return (
    <div className="p-4">
      {/* Tab buttons */}
      <div className="flex border-b border-gray-300">
        <button
          className={`mr-6 pb-2 text-lg font-medium transition-colors ${
            activeTab === 'about'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600 hover:text-primary'
          }`}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>
        <button
          className={`mr-6 pb-2 text-lg font-medium transition-colors ${
            activeTab === 'testimonials'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600 hover:text-primary'
          }`}
          onClick={() => setActiveTab('testimonials')}
        >
          Testimonials
        </button>
        <button
          className={`pb-2 text-lg font-medium transition-colors ${
            activeTab === 'terms'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600 hover:text-primary'
          }`}
          onClick={() => setActiveTab('terms')}
        >
          Terms & Conditions
        </button>
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {activeTab === 'about' && <About />}
        {activeTab === 'testimonials' && <Testimonials />}
        {activeTab === 'terms' && <Terms />}
      </div>
    </div>
  );
};

export default Main;
