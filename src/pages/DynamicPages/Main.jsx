import React, { useState } from 'react';
import About from './About';
import Testimonials from './Testimonials';
import Terms from './Terms';
import FAQs from './FAQs';

const tabConfig = [
  { label: 'About', key: 'about', Component: About },
  { label: 'Testimonials', key: 'testimonials', Component: Testimonials },
  { label: 'Terms & Conditions', key: 'terms', Component: Terms },
  { label: 'FAQs', key: 'faqs', Component: FAQs },
];

const Main = () => {
  const [activeTab, setActiveTab] = useState('about');

  const ActiveComponent = tabConfig.find(tab => tab.key === activeTab)?.Component;

  return (
    <div className="p-4">
      {/* Tab buttons */}
      <div className="flex border-b border-gray-300 mb-4">
        {tabConfig.map(({ label, key }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`mr-6 pb-2 text-lg font-medium transition-colors ${
              activeTab === key
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};

export default Main;
