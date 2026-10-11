import React from 'react';
import { ChevronLeft, HelpCircle, Printer } from 'lucide-react';

export default function Header({ currentScreen, onBack, onHelp, isHelpActive }) {
  // Screens where back button is useful
  const canGoBack = [2, 3, 4, 5, 6, 7, 8, 11, 12].includes(currentScreen);

  return (
    <header className="kiosk-header">
      <div className="kiosk-header-left">
        {canGoBack ? (
          <button 
            type="button" 
            className="kiosk-back-btn" 
            onClick={onBack}
            aria-label="Go Back"
            title="Go Back"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
        ) : null}

        <div className="brand-logo" onClick={() => !canGoBack && onBack?.()}>
          <div className="brand-logo-mark">
            <Printer size={18} strokeWidth={2.5} />
          </div>
          <span className="brand-name">
            qwik<span>print</span>
          </span>
        </div>
      </div>

      <button 
        type="button"
        className={`kiosk-help-btn ${isHelpActive ? 'active' : ''}`}
        onClick={onHelp}
        aria-label="Get Help & FAQs"
      >
        <HelpCircle size={16} strokeWidth={2.2} />
        <span>Help</span>
      </button>
    </header>
  );
}
