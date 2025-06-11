import React, { useState } from 'react';

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  initialIndex?: number;
}

// Tabs component for switching between content sections
const Tabs: React.FC<TabsProps> = ({ tabs, initialIndex = 0 }) => {
  const [active, setActive] = useState(initialIndex);
  return (
    <div>
      <div className="relative flex gap-2 mb-4" role="tablist">
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            className={`text-xs px-3 py-1 font-semibold rounded-xl border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
              ${active === idx
                ? 'bg-blue-600 dark:bg-orange-400 text-white border-blue-600 dark:border-orange-400 z-10'
                : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-orange-200 border-transparent hover:bg-blue-200 dark:hover:bg-blue-800'}
            `}
            onClick={() => setActive(idx)}
            aria-selected={active === idx}
            aria-controls={`tabpanel-${idx}`}
            id={`tab-${idx}`}
            role="tab"
            tabIndex={active === idx ? 0 : -1}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`tabpanel-${active}`} aria-labelledby={`tab-${active}`}>{tabs[active].content}</div>
    </div>
  );
};

export default Tabs; 