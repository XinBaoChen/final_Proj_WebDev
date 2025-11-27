import React, { useState, createContext, useContext } from 'react';

const ConfirmContext = createContext();

export const useConfirm = () => useContext(ConfirmContext);

export const ConfirmProvider = ({ children }) => {
  const [dialog, setDialog] = useState({ open: false });

  const confirm = ({ title = 'Confirm', message = 'Are you sure?', confirmText = 'Delete', cancelText = 'Cancel', confirmClass = 'btn-danger' } = {}) =>
    new Promise((resolve) => {
      setDialog({ open: true, title, message, confirmText, cancelText, confirmClass, resolve });
    });

  const handle = (ok) => {
    if (dialog.resolve) dialog.resolve(ok);
    setDialog({ open: false });
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {dialog.open && (
        <div style={{position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:9998}}>
          <div className="card" style={{maxWidth:420, padding:18, position:'relative', zIndex:9999}}>
            <h3 style={{marginTop:0}}>{dialog.title}</h3>
            <p>{dialog.message}</p>
            <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
              <button className="btn btn-ghost" onClick={() => handle(false)}>{dialog.cancelText || 'Cancel'}</button>
              <button className={dialog.confirmClass || 'btn-danger'} onClick={() => handle(true)}>{dialog.confirmText || 'Delete'}</button>
            </div>
          </div>
          <div style={{position:'absolute', inset:0, background:'rgba(2,6,23,0.3)', zIndex:9998}} />
        </div>
      )}
    </ConfirmContext.Provider>
  );
};

export default ConfirmProvider;
