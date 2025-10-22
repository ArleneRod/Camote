import React, { createContext, useState, useContext, useEffect } from 'react';
import { getDoc, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const CartContext = createContext();

export const CartProvider = ({ children, db, auth }) => {
    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // Solo ejecutar si auth está disponible
        if (!auth) {
            console.log('⚠️ Auth no disponible, usando carrito local');
            return;
        }

        console.log('🔐 Configurando listener de autenticación...');
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                console.log('✅ Usuario autenticado:', user.uid);
            } else {
                setUserId(null);
                setCartItems([]);
                console.log('⚠️ Usuario no autenticado');
            }
        });

        return () => {
            console.log('🔄 Limpiando listener de autenticación');
            unsubscribeAuth();
        };
    }, [auth]);

    useEffect(() => {
        // Solo ejecutar si tenemos db, auth y userId
        if (!db || !auth || !userId) {
            console.log('⚠️ Firebase no disponible, usando carrito local. DB:', !!db, 'Auth:', !!auth, 'UserId:', userId);
            return;
        }

        console.log(`🛒 Configurando listener del carrito para usuario: ${userId}`);
        const userCartRef = doc(db, 'carts', userId);

        const unsubscribeSnapshot = onSnapshot(userCartRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setCartItems(data.items || []);
                console.log('✅ Carrito cargado desde Firestore:', data.items?.length || 0, 'items');
            } else {
                console.log('⚠️ No se encontraron datos del carrito en Firestore');
                setCartItems([]);
            }
        }, (error) => {
            console.error('❌ Error al escuchar cambios del carrito:', error);
        });

        return () => {
            console.log('🔄 Limpiando listener del carrito');
            unsubscribeSnapshot();
        };
    }, [db, auth, userId]);

    const updateCartInFirestore = (newCartItems) => {
        if (!db || !userId) {
            console.log('⚠️ Firestore no disponible, carrito solo en memoria');
            return;
        }

        console.log('💾 Actualizando carrito en Firestore...');
        const userCartRef = doc(db, 'carts', userId);
        setDoc(userCartRef, { items: newCartItems }).catch(error => {
            console.error('❌ Error al actualizar carrito en Firestore:', error);
        });
    };

    const addToCart = (product) => {
        console.log('➕ Agregando producto al carrito:', product.name);
        const updatedItems = [...cartItems];
        const itemIndex = updatedItems.findIndex(item => item.id === product.id);

        if (itemIndex > -1) {
            updatedItems[itemIndex].quantity += 1;
        } else {
            updatedItems.push({ ...product, quantity: 1 });
        }

        setCartItems(updatedItems);
        updateCartInFirestore(updatedItems);
    };

    const increaseQuantity = (productId) => {
        console.log('⬆️ Aumentando cantidad del producto:', productId);
        const updatedItems = cartItems.map(item =>
            item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
        setCartItems(updatedItems);
        updateCartInFirestore(updatedItems);
    };

    const decreaseQuantity = (productId) => {
        console.log('⬇️ Disminuyendo cantidad del producto:', productId);
        const updatedItems = cartItems.map(item =>
            item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        ).filter(item => item.quantity > 0);
        setCartItems(updatedItems);
        updateCartInFirestore(updatedItems);
    };

    const removeFromCart = (productId) => {
        console.log('🗑️ Removiendo producto del carrito:', productId);
        const updatedItems = cartItems.filter(item => item.id !== productId);
        setCartItems(updatedItems);
        updateCartInFirestore(updatedItems);
    };

    const contextValue = {
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        isFirebaseAvailable: !!(db && auth)
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe ser usado dentro de CartProvider');
    }
    return context;
};
