import React from 'react'

interface ConfirmModalProps {
  open: boolean;
  message: string;
  messageList?: string[];
  onConfirm: () => void;
  onCancel: () => void;
  afterMessage?: string;
}

const ConfirmModal = ({open, message, messageList = [], onConfirm, onCancel, afterMessage}: ConfirmModalProps) => {
  if (!open) return null;

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className='confirm-modal' onClick={onCancel}>
      <div className='confirm-card max-w-xl w-full' onClick={handleCardClick}>
        <button
          onClick={onCancel}
          className=" btn-close text-gray-400 hover:text-white text-4xl absolute top-2 right-6"
          aria-label="Close"
        >
          {"\u00D7"}
        </button>        
        <p className='pb-3 font-bold text-center'>{message}</p>
        {messageList.length > 0 && (
          <div className="pb-6 text-left max-h-72 overflow-auto">
            {messageList.map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        )}
        <div className='flex justify-between px-12'>
          <button className='confirm-modal-cancel' onClick={onCancel}>
            Cancel
          </button>
          <button className='confirm-modal-confirm' onClick={onConfirm}>
            Confirm
          </button>
        </div>
        {afterMessage && <p className='pt-4 font-bold text-center text-yellow-400 wrap-break-word whitespace-normal'>{afterMessage}</p>}
      </div>
    </div>
  )
}

export default ConfirmModal