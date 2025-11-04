import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

/**
 * Hook personalizado para usar el contexto del Toast en cualquier componente.
 * @returns {object} { showToast }
 */
export const useToast = () => {
    return useContext(ToastContext);
};

/**
 * Proveedor de contexto para gestionar y mostrar mensajes Toast.
 */
export const ToastProvider = ({ children }) => {
    // Estado para el mensaje Toast actual
    const [toast, setToast] = useState({
        message: '',
        type: 'success', // 'success', 'error', 'info'
        isVisible: false,
    });

    // Función para mostrar un mensaje Toast
    const showToast = useCallback((message, type = 'success', duration = 3000) => {
        // 1. Asegurarse de que cualquier Toast anterior se oculte inmediatamente
        setToast(prev => ({ ...prev, isVisible: false }));

        // 2. Mostrar el nuevo Toast después de un breve retraso (para resetear la animación)
        setTimeout(() => {
            setToast({
                message,
                type,
                isVisible: true,
            });

            // 3. Ocultar el Toast después de la duración especificada
            const timer = setTimeout(() => {
                setToast(prev => ({ ...prev, isVisible: false }));
            }, duration);

            // Limpiar el temporizador si se llama a showToast nuevamente antes de que expire
            return () => clearTimeout(timer);
        }, 50); // Pequeño retraso para asegurar el reset visual
    }, []);

    const value = {
        toast,
        showToast,
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
        </ToastContext.Provider>
    );
};