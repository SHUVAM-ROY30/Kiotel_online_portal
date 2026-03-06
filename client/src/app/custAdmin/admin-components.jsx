// // /custAdmin/admin-component

// import React from 'react';

// export const sharedStyles = `
//   @keyframes fadeIn {
//     from { opacity: 0; transform: translateY(10px); }
//     to { opacity: 1; transform: translateY(0); }
//   }

//   @keyframes spin {
//     to { transform: rotate(360deg); }
//   }

//   /* Page */
//   .page {
//     animation: fadeIn 0.3s ease-out;
//   }

//   .page-header {
//     margin-bottom: 1.75rem;
//   }

//   .page-title {
//     font-size: 26px;
//     font-weight: 700;
//     color: #1e293b;
//     margin-bottom: 0.5rem;
//   }

//   .page-description {
//     font-size: 15px;
//     color: #64748b;
//   }

//   /* Card */
//   .card {
//     background: white;
//     border: 1px solid #e2e8f0;
//     border-radius: 10px;
//     padding: 1.5rem;
//     margin-bottom: 1.5rem;
//   }

//   .card-title {
//     font-size: 16px;
//     font-weight: 600;
//     color: #1e293b;
//     margin-bottom: 1.25rem;
//     padding-bottom: 1rem;
//     border-bottom: 1px solid #f1f5f9;
//   }

//   /* Form */
//   .form-group {
//     margin-bottom: 1.25rem;
//   }

//   .form-label {
//     display: block;
//     font-size: 13px;
//     font-weight: 600;
//     color: #475569;
//     margin-bottom: 0.5rem;
//   }

//   .form-input,
//   .form-select,
//   .form-textarea {
//     width: 100%;
//     padding: 0.625rem 0.875rem;
//     background: #ffffff;
//     border: 1px solid #cbd5e1;
//     border-radius: 7px;
//     font-size: 14px;
//     color: #1e293b;
//     font-family: inherit;
//     transition: all 0.15s;
//   }

//   .form-input:focus,
//   .form-select:focus,
//   .form-textarea:focus {
//     outline: none;
//     border-color: #2563eb;
//     box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
//   }

//   .form-input::placeholder,
//   .form-textarea::placeholder {
//     color: #94a3b8;
//   }

//   .form-textarea {
//     min-height: 90px;
//     resize: vertical;
//   }

//   .form-hint {
//     font-size: 12px;
//     color: #64748b;
//     margin-top: 0.375rem;
//   }

//   .form-row {
//     display: grid;
//     grid-template-columns: 1fr 1fr;
//     gap: 1.25rem;
//   }

//   .form-row-3 {
//     display: grid;
//     grid-template-columns: repeat(3, 1fr);
//     gap: 1.25rem;
//   }

//   @media (max-width: 768px) {
//     .form-row,
//     .form-row-3 {
//       grid-template-columns: 1fr;
//     }
//   }

//   /* Buttons */
//   .btn {
//     display: inline-flex;
//     align-items: center;
//     justify-content: center;
//     gap: 0.5rem;
//     padding: 0.625rem 1.25rem;
//     border-radius: 7px;
//     font-size: 14px;
//     font-weight: 600;
//     cursor: pointer;
//     transition: all 0.15s;
//     border: none;
//     font-family: inherit;
//   }

//   .btn-primary {
//     background: #2563eb;
//     color: white;
//   }

//   .btn-primary:hover:not(:disabled) {
//     background: #1d4ed8;
//   }

//   .btn-primary:disabled {
//     opacity: 0.5;
//     cursor: not-allowed;
//   }

//   .btn-secondary {
//     background: #f1f5f9;
//     color: #475569;
//   }

//   .btn-secondary:hover:not(:disabled) {
//     background: #e2e8f0;
//   }

//   .btn-success {
//     background: #10b981;
//     color: white;
//   }

//   .btn-success:hover:not(:disabled) {
//     background: #059669;
//   }

//   /* Table */
//   .table-wrapper {
//     overflow-x: auto;
//     border: 1px solid #e2e8f0;
//     border-radius: 10px;
//     background: white;
//   }

//   .table {
//     width: 100%;
//     border-collapse: collapse;
//   }

//   .table thead {
//     background: #f8fafc;
//   }

//   .table th {
//     padding: 0.875rem 1rem;
//     text-align: left;
//     font-size: 12px;
//     font-weight: 700;
//     color: #64748b;
//     text-transform: uppercase;
//     letter-spacing: 0.5px;
//     border-bottom: 1px solid #e2e8f0;
//   }

//   .table td {
//     padding: 1rem;
//     font-size: 14px;
//     color: #475569;
//     border-bottom: 1px solid #f1f5f9;
//   }

//   .table tbody tr:last-child td {
//     border-bottom: none;
//   }

//   .table tbody tr:hover {
//     background: #f8fafc;
//   }

//   /* Badge */
//   .badge {
//     display: inline-flex;
//     padding: 0.25rem 0.625rem;
//     border-radius: 5px;
//     font-size: 12px;
//     font-weight: 600;
//   }

//   .badge-pending {
//     background: #fef3c7;
//     color: #92400e;
//   }

//   .badge-approved {
//     background: #d1fae5;
//     color: #065f46;
//   }

//   .badge-active {
//     background: #dbeafe;
//     color: #1e40af;
//   }

//   /* Loading */
//   .loading {
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     padding: 3rem;
//   }

//   .spinner {
//     width: 36px;
//     height: 36px;
//     border: 3px solid #e2e8f0;
//     border-top-color: #2563eb;
//     border-radius: 50%;
//     animation: spin 0.6s linear infinite;
//   }

//   /* Alert */
//   .alert {
//     padding: 0.875rem 1rem;
//     border-radius: 8px;
//     margin-bottom: 1.5rem;
//     font-size: 14px;
//     display: flex;
//     align-items: center;
//     gap: 0.625rem;
//   }

//   .alert-success {
//     background: #d1fae5;
//     color: #065f46;
//     border: 1px solid #a7f3d0;
//   }

//   .alert-error {
//     background: #fee2e2;
//     color: #991b1b;
//     border: 1px solid #fecaca;
//   }

//   .alert-close {
//     margin-left: auto;
//     background: none;
//     border: none;
//     color: inherit;
//     cursor: pointer;
//     font-size: 20px;
//     opacity: 0.6;
//   }

//   .alert-close:hover {
//     opacity: 1;
//   }

//   /* Empty */
//   .empty {
//     text-align: center;
//     padding: 3rem 2rem;
//     color: #94a3b8;
//   }

//   .empty-icon {
//     font-size: 48px;
//     margin-bottom: 0.75rem;
//     opacity: 0.4;
//   }

//   .empty-text {
//     font-size: 15px;
//   }

//   /* Stats */
//   .stats {
//     display: grid;
//     grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
//     gap: 1.25rem;
//     margin-bottom: 1.75rem;
//   }

//   .stat-card {
//     background: white;
//     border: 1px solid #e2e8f0;
//     border-radius: 10px;
//     padding: 1.5rem;
//   }

//   .stat-label {
//     font-size: 12px;
//     font-weight: 700;
//     color: #64748b;
//     text-transform: uppercase;
//     letter-spacing: 0.5px;
//     margin-bottom: 0.75rem;
//   }

//   .stat-value {
//     font-size: 32px;
//     font-weight: 700;
//     line-height: 1;
//   }

//   .stat-blue { color: #2563eb; }
//   .stat-green { color: #10b981; }
//   .stat-amber { color: #f59e0b; }
// `;

// export const LoadingSpinner = () => (
//   <div className="loading">
//     <div className="spinner"></div>
//   </div>
// );

// export const Alert = ({ type, message, onClose }) => (
//   <div className={`alert alert-${type}`}>
//     <span>{type === 'success' ? '✓' : '⚠'}</span>
//     <span>{message}</span>
//     {onClose && (
//       <button className="alert-close" onClick={onClose}>×</button>
//     )}
//   </div>
// );

// export const EmptyState = ({ icon = '○', message }) => (
//   <div className="empty">
//     <div className="empty-icon">{icon}</div>
//     <div className="empty-text">{message}</div>
//   </div>
// );


import React from 'react';

export const sharedStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Page */
  .page {
    animation: fadeIn 0.25s ease-out;
  }

  .page-header {
    margin-bottom: 1.5rem;
  }

  .page-title {
    font-size: 20px;
    font-weight: 700;
    color: #111827;
    letter-spacing: -0.01em;
  }

  .page-description,
  .page-subtitle {
    font-size: 13px;
    color: #6b7280;
    margin-top: 0.25rem;
  }

  /* Card */
  .card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.25rem;
    margin-bottom: 1.25rem;
  }

  .card-title {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #f3f4f6;
  }

  /* Form */
  .form-group {
    margin-bottom: 1rem;
  }

  .form-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.375rem;
    letter-spacing: 0.01em;
  }

  .form-input,
  .form-select,
  .form-textarea {
    width: 100%;
    padding: 0.5rem 0.75rem;
    background: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 13px;
    color: #111827;
    font-family: inherit;
    transition: border-color 0.15s, box-shadow 0.15s;
    line-height: 1.5;
  }

  .form-input:focus,
  .form-select:focus,
  .form-textarea:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
  }

  .form-input::placeholder,
  .form-textarea::placeholder {
    color: #9ca3af;
  }

  .form-textarea {
    min-height: 80px;
    resize: vertical;
  }

  .form-hint {
    font-size: 11px;
    color: #9ca3af;
    margin-top: 0.25rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .form-row-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  @media (max-width: 768px) {
    .form-row,
    .form-row-3 {
      grid-template-columns: 1fr;
    }
  }

  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    border: none;
    font-family: inherit;
    line-height: 1.5;
  }

  .btn-primary {
    background: #2563eb;
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background: #1d4ed8;
  }

  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-secondary {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #e5e7eb;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #e5e7eb;
  }

  .btn-success {
    background: #059669;
    color: white;
  }

  .btn-success:hover:not(:disabled) {
    background: #047857;
  }

  .btn-danger {
    background: #dc2626;
    color: white;
  }

  .btn-danger:hover:not(:disabled) {
    background: #b91c1c;
  }

  /* Table */
  .table-wrapper {
    overflow-x: auto;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: white;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
  }

  .table thead {
    background: #f9fafb;
  }

  .table th {
    padding: 0.625rem 0.875rem;
    text-align: left;
    font-size: 11px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid #e5e7eb;
    white-space: nowrap;
  }

  .table td {
    padding: 0.75rem 0.875rem;
    font-size: 13px;
    color: #374151;
    border-bottom: 1px solid #f3f4f6;
  }

  .table tbody tr:last-child td {
    border-bottom: none;
  }

  .table tbody tr:hover {
    background: #f9fafb;
  }

  /* Badge */
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 0.125rem 0.5rem;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.01em;
  }

  .badge-pending {
    background: #fef3c7;
    color: #92400e;
  }

  .badge-approved {
    background: #d1fae5;
    color: #065f46;
  }

  .badge-active {
    background: #dbeafe;
    color: #1e40af;
  }

  /* Loading */
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.5rem;
  }

  .spinner {
    width: 28px;
    height: 28px;
    border: 3px solid #e5e7eb;
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  /* Alert */
  .alert {
    padding: 0.625rem 0.875rem;
    border-radius: 6px;
    margin-bottom: 1rem;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
  }

  .alert-success {
    background: #ecfdf5;
    color: #065f46;
    border: 1px solid #a7f3d0;
  }

  .alert-error {
    background: #fef2f2;
    color: #991b1b;
    border: 1px solid #fecaca;
  }

  .alert-close {
    margin-left: auto;
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    font-size: 16px;
    opacity: 0.6;
    padding: 0 0.25rem;
    line-height: 1;
  }

  .alert-close:hover {
    opacity: 1;
  }

  /* Empty */
  .empty {
    text-align: center;
    padding: 2.5rem 1.5rem;
    color: #9ca3af;
  }

  .empty-icon {
    font-size: 36px;
    margin-bottom: 0.5rem;
    opacity: 0.3;
  }

  .empty-text {
    font-size: 13px;
    color: #6b7280;
  }

  /* Stats */
  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .stat-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.25rem;
  }

  .stat-label {
    font-size: 11px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }

  .stat-value {
    font-size: 28px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .stat-blue { color: #2563eb; }
  .stat-green { color: #059669; }
  .stat-amber { color: #d97706; }
`;

export const LoadingSpinner = () => (
  <div className="loading">
    <div className="spinner"></div>
  </div>
);

export const Alert = ({ type, message, onClose }) => (
  <div className={`alert alert-${type}`}>
    <span>{type === 'success' ? '✓' : '!'}</span>
    <span>{message}</span>
    {onClose && (
      <button className="alert-close" onClick={onClose}>×</button>
    )}
  </div>
);

export const EmptyState = ({ icon = '—', message }) => (
  <div className="empty">
    <div className="empty-icon">{icon}</div>
    <div className="empty-text">{message}</div>
  </div>
);