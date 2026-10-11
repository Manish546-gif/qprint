import React from 'react';
import { Eye, Minus, Plus, FileText } from 'lucide-react';

export default function Screen5PrintConfig({ config, onChange, totalPages = 6, onPreview }) {
  const ratePerPage = config.colorMode === 'bw' ? 2 : 10;
  const effPages = config.pageSelection === 'all' ? totalPages : (() => {
    if (!config.customRange) return totalPages;
    let c = 0;
    config.customRange.split(',').forEach(p => {
      if (p.includes('-')) {
        const [a, b] = p.split('-').map(Number);
        if (!isNaN(a) && !isNaN(b) && b >= a) c += (b - a + 1);
      } else {
        const n = Number(p.trim());
        if (!isNaN(n) && n > 0) c++;
      }
    });
    return c > 0 ? c : totalPages;
  })();
  const total = effPages * ratePerPage * config.copies;

  const set = (k, v) => onChange({ ...config, [k]: v });

  return (
    <div className="screen-content screen-content-padded fade-slide-up">
      <h1 className="page-title">Make it your print</h1>
      <p className="page-sub">A few quick choices before you print.</p>

      {/* Colour */}
      <div style={{ marginBottom: 18 }}>
        <div className="field-label">
          <span>Colour mode</span>
          <span style={{ textTransform: 'none', fontSize: 12, color: '#0052FF', fontWeight: 700 }}>
            {config.colorMode === 'bw' ? '₹2 / page' : '₹10 / page'}
          </span>
        </div>
        <div className="seg-group">
          {[['bw', 'Black & white', '₹2/page'], ['color', 'Full colour', '₹10/page']].map(([v, label, sub]) => (
            <button key={v} type="button" className={`seg-btn${config.colorMode === v ? ' on' : ''}`} onClick={() => set('colorMode', v)}>
              {label}<span className="seg-sub">{sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sides */}
      <div style={{ marginBottom: 18 }}>
        <div className="field-label">
          <span>Print sides</span>
          <span style={{ textTransform: 'none', fontSize: 12, color: '#10B981', fontWeight: 700 }}>
            {config.sides === 'double' ? 'Eco-friendly' : 'Standard'}
          </span>
        </div>
        <div className="seg-group">
          {[['single', 'Single-sided', '1 side/sheet'], ['double', 'Double-sided', 'Both sides']].map(([v, label, sub]) => (
            <button key={v} type="button" className={`seg-btn${config.sides === v ? ' on' : ''}`} onClick={() => set('sides', v)}>
              {label}<span className="seg-sub">{sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Pages */}
      <div style={{ marginBottom: 18 }}>
        <div className="field-label">
          <span>Pages to print</span>
          <span style={{ textTransform: 'none', fontSize: 12, color: '#64748B' }}>{effPages} of {totalPages}</span>
        </div>
        <div className="seg-group" style={{ marginBottom: config.pageSelection === 'custom' ? 8 : 0 }}>
          {[['all', `All ${totalPages} pages`], ['custom', 'Custom range']].map(([v, label]) => (
            <button key={v} type="button" className={`seg-btn${config.pageSelection === v ? ' on' : ''}`} onClick={() => set('pageSelection', v)}>
              {label}
            </button>
          ))}
        </div>
        {config.pageSelection === 'custom' && (
          <input
            type="text"
            className="text-input"
            placeholder="e.g. 1-3, 5"
            value={config.customRange}
            onChange={e => set('customRange', e.target.value)}
          />
        )}
      </div>

      {/* Copies & Paper */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <div style={{ flex: 1 }}>
          <div className="field-label">Copies</div>
          <div className="qty-row">
            <button type="button" className="qty-btn" onClick={() => set('copies', Math.max(1, config.copies - 1))} disabled={config.copies <= 1}>
              <Minus size={15} />
            </button>
            <span className="qty-val">{config.copies}</span>
            <button type="button" className="qty-btn" onClick={() => set('copies', config.copies + 1)}>
              <Plus size={15} />
            </button>
          </div>
        </div>
        <div style={{ width: 120 }}>
          <div className="field-label">Paper</div>
          <div style={{ height: 52, background: 'white', border: '1px solid #E2E8F0', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
            <FileText size={15} color="#0052FF" /> A4 · 80 GSM
          </div>
        </div>
      </div>

      {/* Price banner */}
      <div className="price-banner" style={{ marginBottom: 16 }}>
        <div>
          <div className="price-banner-label">Estimated total</div>
          <div className="price-banner-calc">{effPages} pgs × ₹{ratePerPage} × {config.copies} {config.copies > 1 ? 'copies' : 'copy'}</div>
        </div>
        <div className="price-banner-amount">₹{total.toFixed(2)}</div>
      </div>

      <button type="button" className="btn-primary" onClick={onPreview}>
        <Eye size={18} />
        Preview document
      </button>
    </div>
  );
}
