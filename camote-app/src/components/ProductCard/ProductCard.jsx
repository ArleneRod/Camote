import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { id, name, image, price } = product;

    return (
        <div className="product-card">
            <Link to={`/productos/${id}`}>
                <img src={image} alt={name} className="product-image" />
            </Link>
            <div className="product-info">
                <Link to={`/productos/${id}`}>
                    <h3 className="product-name">{name}</h3>
                </Link>
                <p className="product-price">{price} &euro;</p>
            </div>
            <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
                Agregar al Carrito
            </button>
        </div>
    );
};

export default ProductCard;
