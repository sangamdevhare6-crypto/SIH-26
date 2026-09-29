import React from 'react';

const ChartCard = ({ title, subtitle, action, children, height = 320 }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="card-header" style={{ marginBottom: '1rem' }}>
        <div>
          <h3 className="card-title">{title}</h3>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div style={{ width: '100%', height: height, minHeight: height, position: 'relative' }}>
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
