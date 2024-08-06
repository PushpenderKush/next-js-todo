import React, { useCallback } from 'react';
import { Modal, Button } from 'rizzui';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
    const handleConfirm = useCallback(() => {
        onConfirm();
        onClose();
    }, [onConfirm, onClose]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-4 bg-white rounded-md">
                <h3 className="text-lg font-semibold mb-4">Confirmation</h3>
                <p>{message}</p>
                <div className="flex justify-end mt-4">
                    <Button onClick={onClose} className="mr-2 text-white">Cancel</Button>
                    <Button onClick={handleConfirm} className="bg-red-600 text-white">Confirm</Button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;
