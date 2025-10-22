import React, { createContext, useContext, useState, useEffect } from 'react';

// Crea el contexto
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    // Inicializa el tema leyendo del localStorage o usando 'light' por defecto
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'light';
    });

    // Efecto para guardar el tema en localStorage cada vez que cambia
    useEffect(() => {
        localStorage.setItem('theme', theme);
        // Aplica la clase 'dark-mode' al body del documento
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [theme]);

    // Función para alternar entre 'light' y 'dark'
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};