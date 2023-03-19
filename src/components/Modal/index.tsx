import React, { useEffect } from 'react';
import './modal.scss';

type ModalProps = {
    children: React.ReactNode;
    closeModal: () => void;
};

export const Modal: React.FC<ModalProps> = ({ children, closeModal }) => {
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.code === 'Escape') {
                closeModal();
            }
        }

        document.addEventListener('keydown', handleEscapeKey)
        return () => document.removeEventListener('keydown', handleEscapeKey)
    }, [closeModal])

    return (
        <div className="modal" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close" onClick={closeModal}>
                    &times;
                </span>
                {children}
            </div>
        </div>
    );
};