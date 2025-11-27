import React, { createContext, useState, useContext } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const push = (message, ms = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, message }]);
    setTimeout(() => {
      setToasts(t => t.filter(x => x.id !== id));
    }, ms);
  };

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div style={{position:'fixed', right:20, top:20, zIndex:9999, display:'flex', flexDirection:'column', gap:8}}>
        {toasts.map(t => (
          <div key={t.id} className="toast card pulse" style={{minWidth:160}}>{t.message}</div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
