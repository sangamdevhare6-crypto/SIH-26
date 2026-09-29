import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorState = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while communicating with the server.',
  onRetry,
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      background: 'var(--surface)',
      border: '1px solid #FECACA',
      backgroundColor: '#FEF2F2',
      borderRadius: 'var(--radius-lg)',
      textAlign: 'center',
      width: '100%',
      margin: '1.5rem 0'
    }}>
      <div style={{
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        background: 'var(--danger-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--danger)',
        marginBottom: '1rem'
      }}>
        <AlertCircle size={28} />
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#991B1B', marginBottom: '0.4rem' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.88rem', color: '#B91C1C', maxWidth: '440px', marginBottom: onRetry ? '1.25rem' : '0' }}>
        {message}
      </p>
      {onRetry && (
        <button className="btn btn-danger btn-sm" onClick={onRetry} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <RefreshCw size={15} /> Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
