import React, { useRef } from 'react';
import { Upload, HardDrive, AlertTriangle, FileText } from 'lucide-react';

export default function Screen2UploadMethod({ onSelectUpload, onTriggerError }) {
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (window.__qwikprintBlobUrl) {
      URL.revokeObjectURL(window.__qwikprintBlobUrl);
    }
    const blobUrl = URL.createObjectURL(f);
    window.__qwikprintBlobUrl = blobUrl;

    const estimatedPages = f.type === 'application/pdf'
      ? Math.max(1, Math.round(f.size / 40000))
      : 1;

    onSelectUpload({
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(1) + ' MB',
      pages: Math.min(estimatedPages, 20),
      type: f.type,
      url: blobUrl,
      isReal: true,
    });
  };

  return (
    <div className="screen-content screen-content-padded fade-slide-up">
      <h1 className="page-title">Upload your file</h1>
      <p className="page-sub">Choose a document from your device to begin printing.</p>

      {/* Primary Device File Upload */}
      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
        style={{ display: 'none' }}
        onChange={handleFile}
      />

      <div
        className="card selected"
        style={{ marginBottom: 14, cursor: 'pointer', padding: 22 }}
        onClick={() => fileRef.current?.click()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <div className="icon-box" style={{ background: '#0052FF', color: 'white' }}>
            <Upload size={22} strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>Browse device files</div>
            <div style={{ fontSize: 12.5, color: '#64748B', marginTop: 2 }}>Tap to choose PDF, DOCX, JPG, or PNG</div>
          </div>
        </div>

        <button type="button" className="btn-primary" style={{ width: '100%' }}>
          <Upload size={17} strokeWidth={2.4} />
          Select file from device
        </button>
      </div>

      {/* USB drive option */}
      <div className="card" style={{ opacity: 0.6, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="icon-box" style={{ background: '#F1F5F9', color: '#94A3B8' }}>
              <HardDrive size={20} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#64748B' }}>Insert USB drive</div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>FAT32 or exFAT supported</div>
            </div>
          </div>
          <span className="pill" style={{ background: '#F1F5F9', color: '#94A3B8', fontSize: 10, border: 'none' }}>SOON</span>
        </div>
      </div>

      {/* Error simulation helper */}
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <button
          type="button"
          onClick={onTriggerError}
          style={{ fontSize: 12, color: '#94A3B8', display: 'inline-flex', alignItems: 'center', gap: 5 }}
        >
          <AlertTriangle size={13} />
          Test file error state
        </button>
      </div>
    </div>
  );
}
