import React from 'react';
import { Link } from 'react-router-dom';
import './FeaturedProducts.css';

// Datos de productos de ejemplo. En una aplicación real, vendrían de una base de datos.
const products = [
    { id: 1, name: 'Arequipe', price: 6.50, country: 'Colombia', isFeatured: true, image: '/arequipe.png' },
    { id: 2, name: 'Churros Congelados', price: 8.75, country: 'México', isFeatured: true, image: '/churros.png' },
    { id: 3, name: 'Inca Kola', price: 3.00, country: 'Perú', isFeatured: true, image: '/incakola.png' },
    { id: 4, name: 'Dulce de Leche', price: 7.20, country: 'Argentina', isFeatured: false, image: '/dulcedeleche.png' },
    { id: 5, name: 'Tostones', price: 5.50, country: 'Colombia', isFeatured: false, image: '/tostones.png' },
    { id: 6, name: 'Yerba Mate', price: 9.99, country: 'Argentina', isFeatured: false, image: '/yerbamate.png' },
    { id: 7, name: 'Ají Amarillo', price: 4.80, country: 'Perú', isFeatured: false, image: '/ajiamarillo.png' },
    { id: 8, name: 'Salsa Valentina', price: 2.50, country: 'México', isFeatured: false, image: '/salsavalentina.png' },
];

const FeaturedProducts = () => {
    // Filtra solo los productos marcados como "destacados"
    const featured = products.filter(product => product.isFeatured);

    return (
        <div className="featured-container">
            <h2>Productos Destacados</h2>
            <div className="featured-grid">
                {featured.map(product => (
                    <div key={product.id} className="featured-card">
                        <Link to={`/productos/${product.id}`}>
                            <img src={product.image} alt={product.name} />
                            <h3>{product.name}</h3>
                        </Link>
                        <p>{product.price} &euro;</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturedProducts;
