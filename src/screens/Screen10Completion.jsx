import React, { useEffect } from 'react';
import { Check, Printer, Home, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Screen10Completion({ orderId, file, amount, config, onPrintAnother, onHome }) {
  useEffect(() => {
    try {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.55 }, colors: ['#0052FF','#10B981','#38BDF8','#6366F1'] });
    } catch {}
  }, []);

  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="screen-content screen-content-padded fade-slide-up">
      {/* Success icon */}
      <div style={{ textAlign: 'center', marginBottom: 16, paddingTop: 8 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#ECFDF5', border: '2px solid #A7F3D0', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 20px -4px rgba(16,185,129,0.28)' }}>
          <Check size={38} strokeWidth={3} />
        </div>
        <h1 className="page-title" style={{ fontSize: 24 }}>Printed. Done.</h1>
        <p style={{ fontSize: 14, color: '#64748B', marginTop: 4 }}>
          Collect your pages from the tray below.
        </p>
      </div>

      {/* Receipt card */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid #F1F5F9' }}>
          <div>
            <div style={{ fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Order receipt</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>#{orderId}</div>
          </div>
          <span className="pill success"><Check size={11} strokeWidth={3} /> Paid</span>
        </div>

        {[
          ['File', file?.name || 'Assignment.pdf'],
          ['Pages', `${file?.pages || 6} pages · ${config?.copies || 1} ${(config?.copies || 1) > 1 ? 'copies' : 'copy'}`],
          ['Payment', `UPI · ₹${amount.toFixed(2)}`],
          ['Date & time', `${date}, ${time}`],
        ].map(([k, v]) => (
          <div key={k} className="receipt-row">
            <span>{k}</span>
            <strong style={{ fontSize: 13 }}>{v}</strong>
          </div>
        ))}
      </div>

      {/* Privacy wipe notice */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '10px 14px', fontSize: 12.5, color: '#64748B', marginBottom: 24 }}>
        <ShieldCheck size={15} color="#10B981" style={{ flexShrink: 0 }} />
        Session ended. Your file has been deleted from kiosk memory.
      </div>

      <button type="button" className="btn-primary" onClick={onPrintAnother} style={{ marginBottom: 10 }}>
        <Printer size={18} /> Print another file
      </button>
      <button type="button" className="btn-secondary" onClick={onHome}>
        <Home size={15} /> Back to home
      </button>
    </div>
  );
}
