import React from "react";

type ModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
};

export default function MessageModal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-sm p-6 relative">
        {onClose && (
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        )}
        {title && <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>}
        <div>{children}</div>
      </div>
    </div>
  );
}
