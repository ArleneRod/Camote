import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext'; // <--- NUEVO

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { showToast } = useToast(); // <--- OBTENER LA FUNCIÓN TOAST

    const handleAddToCart = () => {
        addToCart(product);
        // Mostrar la notificación Toast
        showToast(`¡${product.name} añadido al carrito!`, 'success');
    };

    return (
        <div className="product-card">
            <Link to={`/productos/${product.id}`} className="product-link">
                <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/600x400/CCCCCC/333333?text=Imagen+No+Disp."
                    }}
                />
                <h3 className="product-name">{product.name}</h3>
            </Link>
            <p className="product-country">{product.country}</p>
            <div className="product-actions">
                <p className="product-price">{product.price.toFixed(2)} &euro;</p>
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                    Añadir al Carrito
                </button>
            </div>
        </div>
    );
};

export default ProductCard;

