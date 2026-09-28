import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Event?',
  message = 'This action cannot be undone. All event information will be removed.',
  confirmText = 'Delete Event',
  cancelText = 'Cancel',
  isDeleting = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" showClose={!isDeleting}>
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-6 h-6 text-rose-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="mt-7 flex items-center justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={isDeleting}>
          {cancelText}
        </Button>
        <Button variant="danger" onClick={onConfirm} isLoading={isDeleting}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};
