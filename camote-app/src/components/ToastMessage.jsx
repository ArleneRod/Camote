import React from 'react';
import './ToastMessage.css';
import { useToast } from '../context/ToastContext'; // Usamos el contexto que creamos

const ToastMessage = () => {
    const { toast } = useToast();
    const { message, type, isVisible } = toast;

    if (!message || !isVisible) {
        return null;
    }

    // Clase CSS dinámica basada en el tipo de mensaje (success, error, info)
    const toastClasses = `toast-message ${type} ${isVisible ? 'visible' : ''}`;

    return (
        <div className={toastClasses}>
            <span className="toast-icon">{getIcon(type)}</span>
            <p className="toast-text">{message}</p>
        </div>
    );
};

// Función de utilidad para obtener un ícono basado en el tipo de mensaje
const getIcon = (type) => {
    switch (type) {
        case 'success':
            return '✔'; // Checkmark
        case 'error':
            return '✖'; // X mark
        case 'info':
            return 'ⓘ'; // Info circle
        default:
            return '';
    }
};

export default ToastMessage;