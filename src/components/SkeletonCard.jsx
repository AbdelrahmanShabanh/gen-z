export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img shimmer" />
      <div className="skeleton-body">
        <div className="skeleton-line shimmer" style={{width:'40%', height:'10px', marginBottom:'6px'}} />
        <div className="skeleton-line shimmer" style={{width:'80%', height:'14px', marginBottom:'12px'}} />
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div className="skeleton-line shimmer" style={{width:'35%', height:'16px'}} />
          <div style={{display:'flex', gap:'4px'}}>
            {[1,2,3].map(i => (
              <div key={i} className="skeleton-line shimmer" style={{width:'26px', height:'20px', borderRadius:'4px'}} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .skeleton-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
        }
        .skeleton-img {
          width: 100%;
          aspect-ratio: 1;
        }
        .skeleton-body {
          padding: 1rem;
        }
        .skeleton-line {
          border-radius: 4px;
        }
        .shimmer {
          background: linear-gradient(90deg, var(--bg-elevated) 25%, #2a2a2a 50%, var(--bg-elevated) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
