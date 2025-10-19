import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { AlertTriangleIcon } from '../icons/AlertTriangleIcon';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="p-6 text-center">
            <AlertTriangleIcon className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-brand-dark">{title}</h2>
            <p className="mt-2 text-gray-600">{message}</p>
        </div>
        <div className="p-4 bg-gray-50 border-t flex justify-center gap-4">
            <Button variant="secondary" onClick={onClose}>
                {cancelText}
            </Button>
            <Button variant="danger" onClick={onConfirm}>
                {confirmText}
            </Button>
        </div>
      </Card>
    </div>
  );
};
