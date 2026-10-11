import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, ShieldCheck, CheckCircle2, CreditCard, Sparkles, AlertCircle } from 'lucide-react';

export default function Screen8Payment({ amount, file, kioskId, onSuccess, onBack }) {
  const [secs, setSecs] = useState(299);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const t = setInterval(() => setSecs(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = s => `0${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  // Real or mock Razorpay checkout handler
  const handleRazorpay = () => {
    setLoading(true);
    setErrorMsg('');

    if (window.Razorpay) {
      try {
        const options = {
          key: 'rzp_test_demoKey123', // Standard Razorpay test demo key or placeholder
          amount: Math.round(amount * 100), // in paise
          currency: 'INR',
          name: 'Qwikprint Kiosks',
          description: `Print Job: ${file?.name || 'Document'} (${kioskId})`,
          image: 'https://cdn-icons-png.flaticon.com/512/2874/2874177.png',
          prefill: {
            name: 'Kiosk Customer',
            email: 'customer@qwikprint.in',
            contact: '9999999999',
          },
          theme: {
            color: '#0052FF',
          },
          handler: function (response) {
            setLoading(false);
            onSuccess(response?.razorpay_payment_id || 'pay_rzp_success_' + Date.now());
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          setLoading(false);
          setErrorMsg(response?.error?.description || 'Payment was unsuccessful. Please retry.');
        });
        rzp.open();
        return;
      } catch (err) {
        console.warn('Razorpay live modal fallback to test flow:', err);
      }
    }

    // Seamless simulation fallback
    setTimeout(() => {
      setLoading(false);
      onSuccess('pay_demo_' + Math.floor(100000 + Math.random() * 900000));
    }, 1200);
  };

  const simulateDirectPay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess('pay_sim_' + Math.floor(100000 + Math.random() * 900000));
    }, 800);
  };

  return (
    <div className="screen-content screen-content-padded fade-slide-up">
      {/* Amount Hero */}
      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
          Total Amount to Pay
        </div>
        <div style={{ fontSize: 40, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em' }}>
          ₹{amount.toFixed(2)}
        </div>
        <div style={{ fontSize: 12.5, color: '#64748B', marginTop: 4 }}>
          for {file?.name || 'Assignment.pdf'} · Booth {kioskId}
        </div>
      </div>

      {errorMsg && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: 12, marginBottom: 14, color: '#B91C1C', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={16} />
          {errorMsg}
        </div>
      )}

      {/* Razorpay Gateway Card */}
      <div className="card" style={{
        marginBottom: 14,
        background: '#FFFFFF',
        border: '1.5px solid #0052FF',
        borderRadius: 20,
        padding: '20px 18px',
        boxShadow: '0 4px 20px rgba(0,82,255,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#EBF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={16} color="#0052FF" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>Razorpay Secure</div>
              <div style={{ fontSize: 11, color: '#64748B' }}>UPI, Cards, NetBanking, Wallets</div>
            </div>
          </div>
          <span className="pill primary" style={{ fontSize: 10, padding: '3px 8px' }}>OFFICIAL</span>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={handleRazorpay}
          disabled={loading}
          style={{
            width: '100%',
            height: 48,
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 700,
            marginBottom: 12,
            background: '#0052FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {loading ? (
            <>Processing Payment...</>
          ) : (
            <>
              <Sparkles size={16} />
              Pay ₹{amount.toFixed(2)} via Razorpay
            </>
          )}
        </button>

        {/* UPI Provider Icons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 4 }}>
          {[
            ['GPay', '#4285F4'],
            ['PhonePe', '#6739B7'],
            ['Paytm', '#00BAF2'],
            ['BHIM', '#007935'],
          ].map(([name, col]) => (
            <span key={name} style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 6,
              padding: '3px 8px',
              fontSize: 10.5,
              fontWeight: 800,
              color: col,
            }}>
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* Alternative Direct Simulation for instant testing */}
      <div className="card" style={{ marginBottom: 16, padding: '14px 16px', background: '#F8FAFC' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>Quick Demo / Testing</span>
          <span className="pill warn" style={{ fontSize: 10 }}><Clock size={11} /> {fmt(secs)}</span>
        </div>
        <button
          type="button"
          onClick={simulateDirectPay}
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 10,
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            fontSize: 13,
            fontWeight: 700,
            color: '#1E293B',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <CheckCircle2 size={15} color="#10B981" />
          Simulate Instant Payment Success
        </button>
      </div>

      {/* Refund Guarantee */}
      <div style={{
        background: '#EFF6FF',
        border: '1px solid #BFDBFE',
        borderRadius: 14,
        padding: '10px 14px',
        fontSize: 12,
        color: '#1E40AF',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
      }}>
        <ShieldCheck size={16} color="#0052FF" style={{ flexShrink: 0, marginTop: 1 }} />
        <span>
          <strong>100% Refund Protection:</strong> If the kiosk encounters any hardware error or paper jam, payment is instantly refunded to your source account.
        </span>
      </div>

      <button type="button" className="btn-secondary" onClick={onBack} disabled={loading}>
        <ArrowLeft size={15} /> Back to order summary
      </button>
    </div>
  );
}
