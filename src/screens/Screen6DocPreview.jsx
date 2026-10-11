import React, { useState } from 'react';
import { X, ArrowRight, Edit3, FileText, AlertCircle, ZoomIn } from 'lucide-react';

/* ─── Full-screen PDF viewer overlay ─── */
function PdfFullViewer({ file, bw, onClose }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#1E293B',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Viewer header */}
      <div style={{
        background: '#0F172A',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0,
        paddingTop: 'calc(12px + env(safe-area-inset-top, 0px))',
      }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 20, lineHeight: 1,
          }}
        >
          <X size={18} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {file?.name}
          </div>
          {bw && (
            <div style={{ fontSize: 11, color: '#60A5FA', fontWeight: 600, marginTop: 2 }}>
              ⬛ Black & white mode
            </div>
          )}
        </div>
      </div>

      {/* PDF iframe — full remaining height */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* B&W overlay — mix-blend-mode trick so filter works over iframe */}
        {bw && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            pointerEvents: 'none',
            backgroundColor: 'black',
            mixBlendMode: 'saturation',
          }} />
        )}

        {!loaded && !error && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: '#525659', gap: 14, zIndex: 5,
          }}>
            <div className="spin" style={{
              width: 34, height: 34,
              border: '3px solid rgba(255,255,255,0.15)',
              borderTopColor: 'white', borderRadius: '50%',
            }} />
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
              Loading PDF…
            </span>
          </div>
        )}

        {error ? (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24,
          }}>
            <AlertCircle size={36} color="#F87171" />
            <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>Couldn't load PDF preview</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
              Your file is uploaded correctly and will print as expected.
            </div>
          </div>
        ) : (
          <iframe
            src={`${file.url}#toolbar=0&navpanes=0&scrollbar=1&view=FitH&zoom=page-width`}
            title="PDF Preview"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: loaded ? 'block' : 'none',
              background: '#525659',
            }}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        )}
      </div>
    </div>
  );
}

/* ─── Full-screen Image viewer overlay ─── */
function ImageFullViewer({ file, bw, onClose }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#0F172A', zIndex: 9999,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        background: '#0F172A', padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
        paddingTop: 'calc(12px + env(safe-area-inset-top, 0px))',
      }}>
        <button type="button" onClick={onClose} style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <X size={18} color="white" />
        </button>
        <div style={{ flex: 1, fontSize: 13.5, fontWeight: 700, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {file?.name}
        </div>
        {bw && <span style={{ fontSize: 11, color: '#60A5FA', fontWeight: 700 }}>⬛ B&W</span>}
      </div>

      <div style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        {!loaded && (
          <div className="spin" style={{ width: 32, height: 32, border: '3px solid rgba(255,255,255,0.2)', borderTopColor: 'white', borderRadius: '50%' }} />
        )}
        <img
          src={file.url}
          alt={file.name}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            borderRadius: 8,
            display: loaded ? 'block' : 'none',
            filter: bw ? 'grayscale(1) contrast(1.1)' : 'none',
            transition: 'filter 0.3s',
          }}
          onLoad={() => setLoaded(true)}
        />
      </div>
    </div>
  );
}

/* ─── Mock paper thumbnail (for simulated/QR uploads) ─── */
function MockThumbnail({ file, bw, page, totalPages, onPageChange }) {
  const pages = [
    { chart: 'System Architecture Overview',  lines: [85,95,72,88,60] },
    { chart: 'Data Flow Diagram',             lines: [90,78,95,65,80] },
    { chart: 'Entity-Relationship Diagram',   lines: [70,88,82,92,55] },
    { chart: 'Module Dependency Graph',       lines: [95,72,88,60,78] },
    { chart: 'API Response Flowchart',        lines: [80,90,65,85,70] },
    { chart: 'Deployment Architecture',       lines: [75,92,80,68,88] },
  ];
  const c = pages[(page - 1) % pages.length];

  return (
    <div style={{
      background: 'linear-gradient(145deg,#CBD5E1,#E2E8F0)',
      borderRadius: 20, padding: '18px 14px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
    }}>
      {/* Paper */}
      <div style={{
        width: '100%', maxWidth: 320, background: 'white', borderRadius: 6,
        padding: '22px 20px',
        boxShadow: '0 10px 28px rgba(0,0,0,0.16)',
        filter: bw ? 'grayscale(1) contrast(1.1)' : 'none',
        transition: 'filter 0.35s',
        display: 'flex', flexDirection: 'column', gap: 10, position: 'relative',
      }}>
        <div style={{ position: 'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%) rotate(-30deg)', fontSize:20, fontWeight:800, color:'rgba(0,82,255,0.04)', whiteSpace:'nowrap', pointerEvents:'none' }}>
          QWIKPRINT PREVIEW
        </div>
        <div style={{ borderBottom:'2px solid #E2E8F0', paddingBottom:10, display:'flex', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:11, fontWeight:800, color:'#0F172A' }}>{file?.name?.replace(/\.(pdf|docx|doc)$/i,'') || 'Document'}</div>
            <div style={{ fontSize:8, color:'#94A3B8', marginTop:2 }}>Demo Preview · Page {page}</div>
          </div>
          <div style={{ background:'#F1F5F9', borderRadius:4, padding:'2px 6px', fontSize:8, fontWeight:800, color:'#475569' }}>P.{page}</div>
        </div>
        {c.lines.slice(0,2).map((w,i) => <div key={i} style={{ height:6, background:'#E2E8F0', borderRadius:4, width:`${w}%` }} />)}
        <div style={{
          height:90, borderRadius:8,
          background: bw ? 'linear-gradient(135deg,#374151,#9CA3AF)' : 'linear-gradient(135deg,#0052FF,#38BDF8)',
          display:'flex', alignItems:'center', justifyContent:'center',
          color:'white', fontSize:9, fontWeight:700, textAlign:'center', padding:'0 12px',
        }}>
          Fig {page}.0 — {c.chart}
        </div>
        {c.lines.slice(2).map((w,i) => <div key={i} style={{ height:6, background:'#E2E8F0', borderRadius:4, width:`${w}%` }} />)}
        <div style={{ marginTop:'auto', borderTop:'1px solid #E2E8F0', paddingTop:8, display:'flex', justifyContent:'space-between', fontSize:7.5, color:'#CBD5E1', fontWeight:600 }}>
          <span>Qwikprint · Demo</span><span>Page {page}</span>
        </div>
      </div>

      {/* Pagination */}
      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
        <button type="button" onClick={() => onPageChange(p => Math.max(1,p-1))} disabled={page<=1}
          style={{ width:34,height:34,borderRadius:'50%',background:'white',border:'1px solid #E2E8F0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,opacity:page<=1?0.35:1 }}>‹</button>
        <div style={{ display:'flex', gap:5 }}>
          {Array.from({length:Math.min(totalPages,6)}).map((_,i) => (
            <div key={i} onClick={()=>onPageChange(()=>i+1)} style={{ width:page===i+1?20:7,height:7,borderRadius:999,background:page===i+1?'#0052FF':'#CBD5E1',transition:'all 0.25s',cursor:'pointer' }} />
          ))}
        </div>
        <button type="button" onClick={() => onPageChange(p => Math.min(totalPages,p+1))} disabled={page>=totalPages}
          style={{ width:34,height:34,borderRadius:'50%',background:'white',border:'1px solid #E2E8F0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,opacity:page>=totalPages?0.35:1 }}>›</button>
      </div>
    </div>
  );
}

/* ─── Main Screen 6 ─── */
export default function Screen6DocPreview({ file, config = {}, onContinue, onEdit }) {
  const [page,       setPage]       = useState(1);
  const [viewerOpen, setViewerOpen] = useState(false);

  const totalPages = file?.pages || 6;
  const bw    = (config?.colorMode ?? 'bw') === 'bw';
  const sides = config?.sides   ?? 'single';
  const copies= config?.copies  ?? 1;

  const isReal  = !!file?.isReal && !!file?.url;
  const isImage = isReal && !!file?.type?.startsWith('image/');
  const isPDF   = isReal && (file?.type === 'application/pdf' || file?.name?.toLowerCase().endsWith('.pdf'));
  const isDocx  = isReal && !isImage && !isPDF;

  return (
    <>
      {/* ── Fullscreen viewer overlays ── */}
      {viewerOpen && isPDF && (
        <PdfFullViewer file={file} bw={bw} onClose={() => setViewerOpen(false)} />
      )}
      {viewerOpen && isImage && (
        <ImageFullViewer file={file} bw={bw} onClose={() => setViewerOpen(false)} />
      )}

      {/* ── Main preview screen ── */}
      <div className="screen-content screen-content-padded fade-slide-up">
        <h1 className="page-title">Preview</h1>
        <p className="page-sub" style={{ marginBottom: 14 }}>
          {isReal ? 'Your actual uploaded file.' : 'Demo preview — file is ready to print.'}
        </p>

        {/* B&W notice */}
        {bw && (
          <div style={{
            display:'flex', alignItems:'center', gap:8,
            background:'#1E293B', borderRadius:12, padding:'10px 14px',
            marginBottom:14, fontSize:12.5, fontWeight:600, color:'white',
          }}>
            ⬛ <span>Black & white mode — will print without colour</span>
          </div>
        )}

        {/* File info card */}
        <div style={{
          display:'flex', alignItems:'center', gap:10,
          background:'white', border:'1px solid #E2E8F0', borderRadius:14,
          padding:'12px 14px', marginBottom:16,
          boxShadow:'0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <div style={{
            width:40, height:40, borderRadius:11, flexShrink:0,
            background: isPDF ? '#FEE2E2' : isImage ? '#EDE9FE' : '#EBF2FF',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:11, fontWeight:800,
            color: isPDF ? '#DC2626' : isImage ? '#7C3AED' : '#0052FF',
          }}>
            {isPDF ? 'PDF' : <FileText size={18} />}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:14, fontWeight:700, color:'#0F172A', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {file?.name || 'Assignment.pdf'}
            </div>
            <div style={{ fontSize:12, color:'#64748B', marginTop:1 }}>
              {file?.size} · {totalPages} {totalPages===1?'page':'pages'}
            </div>
          </div>
        </div>

        {/* Preview area */}
        {(isPDF || isImage) && (
          /* Tap to open fullscreen viewer */
          <button
            type="button"
            onClick={() => setViewerOpen(true)}
            style={{
              width:'100%', background:'#1E293B', borderRadius:16,
              padding:'32px 20px', border:'none', cursor:'pointer',
              display:'flex', flexDirection:'column', alignItems:'center', gap:14,
              marginBottom:16, transition:'background 0.15s',
            }}
            onTouchStart={e => e.currentTarget.style.background='#0F172A'}
            onTouchEnd={e => e.currentTarget.style.background='#1E293B'}
          >
            <div style={{ width:60, height:60, borderRadius:'50%', background:'rgba(0,82,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <ZoomIn size={28} color="#60A5FA" />
            </div>
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:'white', textAlign:'center' }}>
                Tap to open full preview
              </div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', textAlign:'center', marginTop:4 }}>
                {isPDF ? 'Opens scrollable PDF viewer' : 'Opens full image view'}
                {bw ? ' · B&W applied' : ''}
              </div>
            </div>
          </button>
        )}

        {isDocx && (
          <div style={{
            width:'100%', background:'white', borderRadius:16, padding:'28px 20px',
            boxShadow:'0 4px 16px rgba(0,0,0,0.06)', textAlign:'center',
            display:'flex', flexDirection:'column', alignItems:'center', gap:14,
            border:'1px solid #E2E8F0', marginBottom:16,
          }}>
            <FileText size={40} color="#0052FF" strokeWidth={1.5} />
            <div>
              <div style={{ fontSize:15, fontWeight:800, color:'#0F172A', marginBottom:4 }}>{file.name}</div>
              <div style={{ fontSize:13, color:'#64748B' }}>{file.size} · {file.pages} pages estimated</div>
            </div>
            <div style={{ background:'#ECFDF5', border:'1px solid #A7F3D0', borderRadius:10, padding:'8px 16px', fontSize:13, color:'#10B981', fontWeight:700 }}>
              ✓ File uploaded and ready to print
            </div>
            <p style={{ fontSize:12, color:'#94A3B8', lineHeight:1.6, maxWidth:240 }}>
              Word files cannot be previewed in the browser but will print correctly.
            </p>
          </div>
        )}

        {!isReal && (
          <div style={{ marginBottom: 16 }}>
            <MockThumbnail file={file} bw={bw} page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}

        {/* Spec tags */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:20 }}>
          {[
            'A4 · 80 GSM',
            bw ? '⬛ B&W' : '🎨 Colour',
            sides==='double' ? '↕ Double-sided' : '↓ Single-sided',
            `${copies} ${copies>1?'copies':'copy'}`,
          ].map((s,i) => (
            <span key={i} style={{ fontSize:12,fontWeight:700,color:'#475569',background:'#F1F5F9',border:'1px solid #E2E8F0',padding:'5px 10px',borderRadius:999 }}>
              {s}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <button type="button" className="btn-primary" onClick={onContinue} style={{ marginBottom:10 }}>
          Continue to summary <ArrowRight size={17} />
        </button>
        <button type="button" className="btn-secondary" onClick={onEdit}>
          <Edit3 size={15} /> Edit print settings
        </button>
      </div>
    </>
  );
}
