import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductDetailsPage.css';
import ProductCard from '../components/ProductCard/ProductCard'; // Usaremos la tarjeta de producto

// Aquí pondríamos una base de datos real, pero por ahora usaremos los datos de ejemplo
const productsData = {
    peru: [
        { id: 1, name: 'Ají Amarillo', image: 'https://placehold.co/100x100/f7a43e/ffffff?text=Ají', price: 4.99, description: 'El ají amarillo es un ingrediente esencial en la cocina peruana. Se utiliza para preparar una gran variedad de platos, como el ají de gallina y la causa.', country: 'Perú' },
        { id: 2, name: 'Chicha Morada', image: 'https://placehold.co/100x100/f7a43e/ffffff?text=Chicha', price: 3.99, description: 'La chicha morada es una bebida refrescante hecha a base de maíz morado. Es dulce y deliciosa, perfecta para acompañar cualquier comida.', country: 'Perú' },
        { id: 3, name: 'Inca Kola', image: 'https://placehold.co/100x100/f7a43e/ffffff?text=Inka', price: 2.25, description: 'La bebida nacional del Perú. Inca Kola es una gaseosa de color amarillo dorado con un sabor dulce y afrutado, muy refrescante.', country: 'Perú' },
    ],
    colombia: [
        { id: 4, name: 'Café Colombiano', image: 'https://placehold.co/100x100/f7a43e/ffffff?text=Café', price: 8.99, description: 'Un café de alta calidad, conocido por su sabor suave, aroma rico y acidez equilibrada. Es uno de los mejores cafés del mundo.', country: 'Colombia' },
        { id: 5, name: 'Arequipe', image: 'https://placehold.co/100x100/f7a43e/ffffff?text=Arequipe', price: 5.50, description: 'Un dulce tradicional de Colombia, similar al dulce de leche. Es un postre cremoso y delicioso, ideal para postres o para untar.', country: 'Colombia' },
        { id: 6, name: 'Pan de Bono', image: 'https://placehold.co/100x100/f7a43e/ffffff?text=PdB', price: 6.75, description: 'Un panecillo tradicional hecho con harina de yuca y queso. Es un snack delicioso, crujiente por fuera y suave por dentro.', country: 'Colombia' },
    ],
    mexico: [
        { id: 7, name: 'Mole Poblano', image: 'https://placehold.co/100x100/f7a43e/ffffff?text=Mole', price: 7.99, description: 'El mole poblano es una salsa espesa y compleja, hecha con chiles, especias, chocolate y nueces. Se sirve tradicionalmente con pollo.', country: 'México' },
        { id: 8, name: 'Tortillas de Maíz', image: 'https://placehold.co/100x100/f7a43e/ffffff?text=Tortillas', price: 3.50, description: 'Tortillas de maíz frescas, perfectas para tacos, quesadillas, o para acompañar tus platillos favoritos. Un elemento básico de la cocina mexicana.', country: 'México' },
        { id: 9, name: 'Salsa Picante', image: 'https://placehold.co/100x100/f7a43e/ffffff?text=Salsa', price: 2.99, description: 'Una salsa picante y sabrosa, perfecta para darle un toque extra a tus comidas. Es ideal para tacos, nachos, huevos y más.', country: 'México' },
    ],
};

// Combinar todos los productos en una lista plana
const allProducts = Object.values(productsData).flat();

const ProductDetailsPage = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1); // Nuevo estado para la cantidad

    // 1. Encontrar el producto actual
    const product = allProducts.find(p => p.id === parseInt(id));

    // 2. Lógica de Productos Relacionados
    const relatedProducts = useMemo(() => {
        if (!product) return [];

        // Filtra productos del mismo país, excluyendo el producto actual
        return allProducts
            .filter(p => p.country === product.country && p.id !== product.id)
            .slice(0, 3); // Limitar a un máximo de 3 relacionados
    }, [product]);

    if (!product) {
        return <div className="product-details-page">Producto no encontrado.</div>;
    }

    const handleAddToCart = () => {
        // Llama a addToCart con la cantidad especificada
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        // Opcional: reiniciar la cantidad a 1 después de agregar
        setQuantity(1);
    };

    return (
        <div className="product-details-page">
            <Link to="/productos" className="back-link">
                &larr; Volver a Productos
            </Link>

            {/* ---------------------------------------------------- */}
            {/* SECCIÓN PRINCIPAL DE DETALLES */}
            {/* ---------------------------------------------------- */}
            <div className="details-container">
                <img src={product.image} alt={product.name} className="details-image" />
                <div className="details-info">
                    <h1>{product.name}</h1>
                    <span className="product-country">País: {product.country}</span>
                    <p className="details-description">{product.description}</p>
                    <p className="details-price">Precio: {(product.price * quantity).toFixed(2)} &euro;</p>

                    {/* Controles de Cantidad */}
                    <div className="quantity-controls">
                        <button
                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                            disabled={quantity === 1}
                        >
                            -
                        </button>
                        <span>{quantity}</span>
                        <button
                            onClick={() => setQuantity(prev => prev + 1)}
                        >
                            +
                        </button>
                    </div>

                    <button className="add-to-cart-btn" onClick={handleAddToCart}>
                        Agregar {quantity} al Carrito
                    </button>
                </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* SECCIÓN DE PRODUCTOS RELACIONADOS */}
            {/* ---------------------------------------------------- */}
            {relatedProducts.length > 0 && (
                <div className="related-products-section">
                    <h2>Productos Relacionados de {product.country}</h2>
                    <div className="related-products-grid">
                        {relatedProducts.map(related => (
                            <ProductCard
                                key={related.id}
                                product={related}
                                onAddToCart={addToCart}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetailsPage;