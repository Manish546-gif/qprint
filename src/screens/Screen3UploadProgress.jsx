import React, { useState, useEffect } from 'react';
import { FileText, X, ArrowRight } from 'lucide-react';

export default function Screen3UploadProgress({ file, onComplete, onCancel }) {
  const [progress, setProgress] = useState(20);

  useEffect(() => {
    const t = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(t); setTimeout(onComplete, 500); return 100; }
        return p + 8;
      });
    }, 180);
    return () => clearInterval(t);
  }, [onComplete]);

  return (
    <div className="screen-content screen-content-padded fade-slide-up">
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title">Sending your file...</h1>
        <p className="page-sub" style={{ marginBottom: 0 }}>Keep this screen open for a moment.</p>
      </div>

      {/* File card */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: '#FEE2E2', color: '#DC2626',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 12, flexShrink: 0,
        }}>
          PDF
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {file?.name || 'Assignment.pdf'}
          </div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
            {file?.pages || 6} pages · {file?.size || '2.4 MB'}
          </div>
        </div>
        {progress < 100 && (
          <div className="spin" style={{ width: 20, height: 20, border: '2.5px solid #0052FF', borderTopColor: 'transparent', borderRadius: '50%', flexShrink: 0 }} />
        )}
      </div>

      {/* Progress */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 600, color: '#475569', marginBottom: 10 }}>
          <span>Uploading document</span>
          <span style={{ color: '#0052FF', fontWeight: 700 }}>{progress}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p style={{ fontSize: 12, color: '#64748B', marginTop: 8 }}>
          {progress < 100 ? 'Preparing your preview...' : '✓ Upload complete!'}
        </p>
      </div>

      {/* Quick continue option */}
      <button type="button" className="btn-primary" onClick={onComplete} style={{ marginBottom: 10 }}>
        Continue
        <ArrowRight size={17} />
      </button>
      <button type="button" className="btn-secondary" onClick={onCancel}>
        <X size={15} />
        Cancel upload
      </button>
    </div>
  );
}
