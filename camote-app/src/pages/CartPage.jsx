import React from 'react';
import './CartPage.css';
import { useCart } from '../context/CartContext';

const CartPage = () => {
    const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

    // Calcula el total general del carrito
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

    return (
        <div className="cart-page">
            <h1>Tu Carrito</h1>
            {cartItems.length === 0 ? (
                <p>Tu carrito está vacío.</p>
            ) : (
                <>
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <img src={item.image} alt={item.name} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <h3>{item.name}</h3>
                                    <p>Precio: {item.price} &euro;</p>
                                    <div className="quantity-controls">
                                        <button onClick={() => decreaseQuantity(item.id)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => increaseQuantity(item.id)}>+</button>
                                    </div>
                                    <p className="item-subtotal">Subtotal: {(item.price * item.quantity).toFixed(2)} &euro;</p>
                                </div>
                                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Eliminar</button>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h2>Total: {total} &euro;</h2>
                        <button className="checkout-btn">Finalizar Compra</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;
