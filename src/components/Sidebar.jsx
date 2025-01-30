import React, { useState } from 'react';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sidebar-container">
      <button className="toggle-button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          "o"
        ) : (
          "o"
        )}
      </button>
      <div className={`sidebar ${!isOpen ? 'open' : ''}`}>
        <div className="object-info-container">
          <h2 className="object-name">ObjectName</h2>
          <p className="object-description">Object Description here.</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;