import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ProductsPage from './pages/ProductsPage';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext'; // Importar el proveedor del contexto del tema
import ThemeToggle from './components/ThemeToggle/ThemeToggle'; // Importar el botón de tema flotante
import './App.css';

// Importa las librerías de Firebase. Asegúrate de que los nombres de los paquetes estén correctos.
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Variables globales proporcionadas por el entorno de Canvas
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Inicializa Firebase solo si la configuración es válida
let app, auth, db;
try {
    if (firebaseConfig && firebaseConfig.apiKey) {
        console.log('🔥 Inicializando Firebase...');
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        console.log('✅ Firebase inicializado correctamente');
    } else {
        console.warn("⚠️ Firebase config no disponible, usando valores por defecto");
        auth = null;
        db = null;
    }
} catch (error) {
    console.error("❌ Error inicializando Firebase:", error);
    auth = null;
    db = null;
}

function App() {
    useEffect(() => {
        const handleAuth = async () => {
            try {
                if (auth) {
                    if (initialAuthToken) {
                        await signInWithCustomToken(auth, initialAuthToken);
                        console.log('✅ Autenticado con token personalizado');
                    } else {
                        await signInAnonymously(auth);
                        console.log('✅ Autenticado anónimamente');
                    }
                } else {
                    console.log('⚠️ Auth no disponible, continuando sin autenticación');
                }
            } catch (error) {
                console.error("❌ Firebase Auth Error:", error);
            }
        };

        handleAuth();
    }, []);

    console.log('🚀 App renderizando con auth:', !!auth, 'db:', !!db);

    return (
        <Router>
            {/* El ThemeProvider debe ser el componente más externo para que todos puedan acceder al tema */}
            <ThemeProvider>
                <CartProvider db={db} auth={auth}>
                    <div className="App">
                        <Header />
                        <main>
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/productos" element={<ProductsPage />} />
                                <Route path="/productos/:id" element={<ProductDetailsPage />} />
                                <Route path="/carrito" element={<CartPage />} />
                                <Route path="/acerca-de" element={<AboutPage />} />
                                <Route path="/contacto" element={<ContactPage />} />
                            </Routes>
                        </main>
                        <Footer />
                        {/* El botón flotante debe estar al final del contenedor principal */}
                        <ThemeToggle />
                    </div>
                </CartProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;




