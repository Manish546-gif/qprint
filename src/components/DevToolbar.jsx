import React from 'react';
import { Smartphone, Monitor, RotateCcw, Eye, Sparkles } from 'lucide-react';

export const SCREENS_LIST = [
  { id: 1, name: 'Screen 1: Welcome Splash', label: '1. Welcome Splash ("Print in seconds")' },
  { id: 2, name: 'Screen 2: Choose Upload Method', label: '2. Upload Method ("Choose how to upload")' },
  { id: 3, name: 'Screen 3: File Upload Progress', label: '3. Upload Progress ("Sending your file...")' },
  { id: 4, name: 'Screen 4: Customisation Hub', label: '4. Customise Hub ("All set to customise")' },
  { id: 5, name: 'Screen 5: Print Configuration', label: '5. Configuration ("Make it your print")' },
  { id: 6, name: 'Screen 6: Document Preview', label: '6. Document Preview ("Looks good on paper")' },
  { id: 7, name: 'Screen 7: Order Summary', label: '7. Order Summary ("One last look")' },
  { id: 8, name: 'Screen 8: UPI Payment Gateway', label: '8. Payment Gateway ("Pay & on your way")' },
  { id: 9, name: 'Screen 9: Printing Progress', label: '9. Printing Progress ("Making paper magic")' },
  { id: 10, name: 'Screen 10: Order Completion', label: '10. Completed ("Printed. Picked up. Done.")' },
  { id: 11, name: 'Screen 11: Help & FAQs', label: '11. Help & FAQ ("A little help, anytime")' },
  { id: 12, name: 'Screen 12: File Error & Retry', label: '12. File Error ("This file needs another try")' },
];

export default function DevToolbar({ 
  currentScreen, 
  onSelectScreen, 
  isFullscreen, 
  onToggleFullscreen,
  onReset 
}) {
  return (
    <div className="dev-toolbar">
      <div className="dev-toolbar-brand">
        <Sparkles size={16} color="#38BDF8" />
        <span>Qwikprint Kiosk Simulator</span>
        <span className="dev-toolbar-badge">Figma Match</span>
      </div>

      <div className="dev-toolbar-screen-selector">
        <label htmlFor="screen-select" style={{ opacity: 0.8 }}>Screen:</label>
        <select 
          id="screen-select"
          className="dev-toolbar-select"
          value={currentScreen}
          onChange={(e) => onSelectScreen(Number(e.target.value))}
        >
          {SCREENS_LIST.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="dev-toolbar-actions">
        <button 
          type="button"
          className={`dev-btn ${!isFullscreen ? 'active' : ''}`}
          onClick={() => onToggleFullscreen(false)}
          title="Kiosk Chassis Stand (375x812)"
        >
          <Smartphone size={13} />
          <span>Kiosk Frame</span>
        </button>

        <button 
          type="button"
          className={`dev-btn ${isFullscreen ? 'active' : ''}`}
          onClick={() => onToggleFullscreen(true)}
          title="Full Screen Display"
        >
          <Monitor size={13} />
          <span>Full Display</span>
        </button>

        <button 
          type="button"
          className="dev-btn"
          onClick={onReset}
          title="Restart from Welcome Screen"
        >
          <RotateCcw size={13} />
          <span>Reset Flow</span>
        </button>
      </div>
    </div>
  );
}
