import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Header.css';

const Header = () => {
    const { cartItems } = useCart();

    // Calcular el total de artículos en el carrito
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <header className="header-container">
            <Link to="/" className="logo">
                <img src="/logo-camote.png" alt="Camote Logo" />
            </Link>
            <nav>
                <ul>
                    <li><Link to="/">Inicio</Link></li>
                    <li><Link to="/productos">Productos</Link></li>
                    <li>
                        <Link to="/carrito" className="cart-icon-container">
                            Carrito
                            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                        </Link>
                    </li>
                    <li><Link to="/nosotros">Acerca de Nosotros</Link></li>
                    <li><Link to="/contacto">Contacto</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;


