import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading data...', size = 32 }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
      <Loader2 size={size} className="animate-spin" style={{ color: 'var(--primary)', marginBottom: '0.8rem' }} />
      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>{message}</span>
    </div>
  );
};

export default LoadingSpinner;
