import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import productsData from '../data/products.json';
import ProductCard from '../components/ProductCard/ProductCard';
import { useCart } from '../context/CartContext'; // Asegúrate de que esta importación esté correcta
import { useTheme } from '../context/ThemeContext';
import './HomePage.css';

const HomePage = () => {
    const { theme } = useTheme();
    const { addToCart } = useCart(); // Obtener la función addToCart

    // Lógica para seleccionar productos destacados (6 productos al azar)
    const featuredProducts = useMemo(() => {
        // Asegurarse de que productsData.products sea un array
        const allProducts = Array.isArray(productsData.products) ? productsData.products : [];

        if (allProducts.length === 0) return [];

        // Creamos una copia para no mutar el array original
        const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
        // Devolvemos los primeros 6 productos
        return shuffled.slice(0, 6);
    }, []);

    return (
        <div className={`home-page ${theme}`}>
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Sabor Latino en tu Puerta</h1>
                    <p>Descubre auténticos productos de Perú, Colombia y México. Directo a tu cocina.</p>
                    <Link to="/productos" className="shop-button">
                        Explorar Productos
                    </Link>
                </div>
                <div className="hero-image">
                    {/* Placeholder para una imagen atractiva */}
                    <img
                        src="https://placehold.co/600x400/f7a43e/ffffff?text=Camote+Sabores"
                        alt="Productos latinos"
                        className="main-hero-img"
                    />
                </div>
            </section>

            {/* Nueva Sección de Productos Destacados (Carrusel) */}
            <section className="featured-section">
                <h2>Nuestros Productos Destacados</h2>
                <div className="featured-products-container">
                    {featuredProducts.length > 0 ? (
                        featuredProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={addToCart}
                            />
                        ))
                    ) : (
                        <p>Cargando productos...</p>
                    )}
                </div>
                <Link to="/productos" className="view-all-button">
                    Ver todo el catálogo &rarr;
                </Link>
            </section>

            <section className="about-preview">
                <h2>¿Quiénes Somos?</h2>
                <p>Más que una tienda, somos un puente cultural que trae la alegría y la riqueza de la comida latina a tu mesa.</p>
                <Link to="/acerca-de" className="learn-more-button">
                    Conoce Nuestra Historia
                </Link>
            </section>
        </div>
    );
};

export default HomePage;
