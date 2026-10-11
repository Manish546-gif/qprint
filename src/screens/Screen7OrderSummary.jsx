import React from 'react';
import { FileCheck, MapPin, CreditCard, Edit3, ShieldCheck, CheckCircle2, KeyRound } from 'lucide-react';

export default function Screen7OrderSummary({ file, config, kioskId, amount, onPay, onEdit }) {
  const ratePerPage = config.colorMode === 'bw' ? 2 : 10;
  const effPages = config.pageSelection === 'all' ? (file?.pages || 6) : 4;

  const rows = [
    ['Print mode', config.colorMode === 'bw' ? 'Black & white' : 'Full Colour'],
    ['Sides', config.sides === 'double' ? 'Double-sided' : 'Single-sided'],
    ['Paper', 'A4 · 80 GSM'],
    ['Copies', `${config.copies} ${config.copies > 1 ? 'copies' : 'copy'}`],
    ['Price calc', `${effPages} pgs × ₹${ratePerPage}`],
  ];

  return (
    <div className="screen-content screen-content-padded fade-slide-up">
      <h1 className="page-title">One last look</h1>
      <p className="page-sub">Review everything before you pay.</p>

      {/* Hardware Pre-flight Health Badge */}
      <div style={{
        background: '#ECFDF5',
        border: '1px solid #A7F3D0',
        borderRadius: 14,
        padding: '10px 14px',
        marginBottom: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
          <span style={{ fontSize: 12.5, fontWeight: 700, color: '#065F46' }}>
            Booth {kioskId} Verified
          </span>
        </div>
        <span style={{ fontSize: 11.5, color: '#047857', fontWeight: 600 }}>
          Paper & Toner Ready ✓
        </span>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        {/* File header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid #F1F5F9' }}>
          <FileCheck size={20} color="#0052FF" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{file?.name || 'Assignment.pdf'}</div>
            <div style={{ fontSize: 12, color: '#64748B' }}>{effPages} pages selected</div>
          </div>
        </div>

        {/* Rows */}
        {rows.map(([label, val]) => (
          <div key={label} className="receipt-row">
            <span>{label}</span>
            <strong>{val}</strong>
          </div>
        ))}

        {/* Total */}
        <div className="divider-dashed" />
        <div className="receipt-row total">
          <span>Total</span>
          <span className="receipt-total-price">₹{amount.toFixed(2)}</span>
        </div>
      </div>

      {/* How it prints notice */}
      <div style={{
        background: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: 14,
        padding: '12px 14px',
        marginBottom: 20,
        fontSize: 12.5,
        color: '#475569',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#0F172A' }}>
          <KeyRound size={15} color="#0052FF" />
          <span>How will it print?</span>
        </div>
        <p style={{ margin: 0, lineHeight: 1.4, color: '#64748B' }}>
          After payment, you will receive a <strong>6-digit Release Code</strong>. Enter it on the booth screen to instantly collect your prints.
        </p>
      </div>

      <button type="button" className="btn-primary" onClick={onPay} style={{ marginBottom: 10 }}>
        <CreditCard size={18} /> Pay ₹{amount.toFixed(2)} with Razorpay
      </button>
      <button type="button" className="btn-secondary" onClick={onEdit}>
        <Edit3 size={15} /> Edit settings
      </button>
    </div>
  );
}
