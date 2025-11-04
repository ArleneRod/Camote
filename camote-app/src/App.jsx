import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, signInWithCustomToken, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import './App.css';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ToastMessage from './components/ToastMessage';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';

const App = () => {
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);

    // Inicialización de Firebase
    useEffect(() => {
        let firebaseAuth;

        try {
            // Configuración de Firebase desde variables de entorno
            const firebaseConfig = {
                apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
                authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
                projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
                storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
                messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
                appId: import.meta.env.VITE_FIREBASE_APP_ID
            };

            // Validar que la configuración esté completa
            if (!firebaseConfig.projectId) {
                console.error("ERROR: No se encontró 'projectId' en la configuración de Firebase. Por favor, configura tu archivo .env con las credenciales de Firebase.");
                setIsFirebaseInitialized(true);
                return;
            }

            const app = initializeApp(firebaseConfig);
            const firestoreDb = getFirestore(app);
            firebaseAuth = getAuth(app);

            setDb(firestoreDb);
            setAuth(firebaseAuth);

            // Intentar establecer persistencia de sesión antes de autenticar
            setPersistence(firebaseAuth, browserSessionPersistence).then(() => {
                // Autenticación inicial
                const authenticate = async () => {
                    const initialAuthToken = import.meta.env.VITE_INITIAL_AUTH_TOKEN;
                    if (initialAuthToken) {
                        await signInWithCustomToken(firebaseAuth, initialAuthToken);
                    } else {
                        await signInAnonymously(firebaseAuth);
                    }
                    setIsFirebaseInitialized(true);
                };
                authenticate();
            }).catch((error) => {
                console.error("Error al establecer persistencia de Firebase:", error);
                setIsFirebaseInitialized(true);
            });

        } catch (error) {
            console.error("Error fatal durante la inicialización de Firebase:", error);
            setIsFirebaseInitialized(true); // Evita bucle de carga
        }
    }, []);

    if (!isFirebaseInitialized || !db || !auth) {
        return (
            <div className="loading-screen">
                <p>Cargando aplicación...</p>
            </div>
        );
    }

    return (
        <Router>
            <ThemeProvider>
                <ToastProvider>
                    <CartProvider db={db} auth={auth}>
                        <div className="App">
                            <Header />
                            <main>
                                <Routes>
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/productos" element={<ProductsPage />} />
                                    <Route path="/productos/:id" element={<ProductDetailsPage />} />
                                    <Route path="/carrito" element={<CartPage />} />
                                    <Route path="/nosotros" element={<AboutPage />} />
                                    <Route path="/contacto" element={<ContactPage />} />
                                </Routes>
                            </main>
                            <Footer />
                            <ThemeToggle />
                            <ToastMessage />
                        </div>
                    </CartProvider>
                </ToastProvider>
            </ThemeProvider>
        </Router>
    );
};

export default App;




