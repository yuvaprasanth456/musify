import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3200) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className="toast-message"
            style={{
              borderLeftColor: toast.type === 'error' ? '#ef4444' : toast.type === 'info' ? '#3b82f6' : '#1db954'
            }}
          >
            {toast.type === 'error' ? (
              <AlertCircle size={20} color="#ef4444" />
            ) : toast.type === 'info' ? (
              <Info size={20} color="#3b82f6" />
            ) : (
              <CheckCircle size={20} color="#1db954" />
            )}
            <span style={{ flex: 1, fontSize: '13.5px', fontWeight: 500 }}>{toast.message}</span>
            <button 
              onClick={() => removeToast(toast.id)} 
              style={{ padding: '2px', color: 'var(--text-secondary)' }}
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return { addToast: console.log, removeToast: () => {} };
  }
  return context;
}
