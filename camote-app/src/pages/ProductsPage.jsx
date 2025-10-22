import React, { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard/ProductCard';
// Nota: Importamos el array plano directamente para facilitar el uso
import productsData from '../data/products.json';
import { useCart } from '../context/CartContext';
import './ProductsPage.css';
import { useTheme } from '../context/ThemeContext';

// Número de productos a mostrar por página
const PRODUCTS_PER_PAGE = 6;

// Aplanamos la estructura de datos para que sea más fácil de filtrar y paginar
const allProducts = Object.values(productsData).flat();

const ProductsPage = () => {
    const { theme } = useTheme();
    const { addToCart } = useCart();

    // Estado para la búsqueda
    const [searchTerm, setSearchTerm] = useState('');
    // Estado para el filtro por país
    const [selectedCountry, setSelectedCountry] = useState('Todos');
    // Estado para la ordenación
    const [sortOrder, setSortOrder] = useState('default'); // 'default', 'price-asc', 'price-desc'
    // Estado para la paginación
    const [currentPage, setCurrentPage] = useState(1);

    // Extraer todos los países únicos
    const allCountries = useMemo(() => {
        const countries = allProducts.map(p => p.country);
        return ['Todos', ...new Set(countries)].filter(Boolean);
    }, []);

    // ----------------------------------------------------
    // Lógica de Búsqueda, Filtrado y Ordenación (Una sola función)
    // ----------------------------------------------------
    const filteredAndSortedProducts = useMemo(() => {
        let tempProducts = [...allProducts];

        // 1. Filtrado por término de búsqueda (Search Term)
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            tempProducts = tempProducts.filter(product =>
                product.name.toLowerCase().includes(lowerCaseSearch) ||
                product.description.toLowerCase().includes(lowerCaseSearch)
            );
        }

        // 2. Filtrado por país
        if (selectedCountry !== 'Todos') {
            tempProducts = tempProducts.filter(product => product.country === selectedCountry);
        }

        // 3. Ordenación por precio
        if (sortOrder === 'price-asc') {
            tempProducts.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'price-desc') {
            tempProducts.sort((a, b) => b.price - a.price);
        }

        return tempProducts;
    }, [searchTerm, selectedCountry, sortOrder]);

    // Al cambiar filtros u orden, regresar a la primera página usando un useEffect o dentro del handle.
    // Lo hacemos en el return del hook useMemo para asegurar que se ejecuta después del cálculo.
    React.useEffect(() => {
        setCurrentPage(1);
    }, [filteredAndSortedProducts]);


    // ----------------------------------------------------
    // Lógica de Paginación
    // ----------------------------------------------------
    const totalProducts = filteredAndSortedProducts.length;
    const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
        const endIndex = startIndex + PRODUCTS_PER_PAGE;
        return filteredAndSortedProducts.slice(startIndex, endIndex);
    }, [filteredAndSortedProducts, currentPage]);


    const goToPage = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const renderPaginationControls = () => {
        const pageControls = [];
        // Limita la visualización de páginas si hay muchas
        const maxPagesToShow = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }


        for (let i = startPage; i <= endPage; i++) {
            pageControls.push(
                <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={i === currentPage ? 'active' : ''}
                    aria-label={`Ir a la página ${i}`}
                >
                    {i}
                </button>
            );
        }
        return pageControls;
    };

    return (
        <div className={`products-page ${theme}`}>
            <h1>Nuestros Productos Latinos</h1>

            <div className="controls-container">
                {/* Campo de Búsqueda */}
                <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                    aria-label="Campo de búsqueda de productos"
                />

                {/* Filtros por País */}
                <div className="filters-container">
                    {allCountries.map(country => (
                        <button
                            key={country}
                            onClick={() => setSelectedCountry(country)}
                            className={selectedCountry === country ? 'active' : ''}
                            aria-label={`Filtrar productos de ${country}`}
                        >
                            {country}
                        </button>
                    ))}
                </div>

                {/* Botones de Ordenación */}
                <div className="sort-buttons">
                    <button
                        onClick={() => setSortOrder('price-asc')}
                        className={sortOrder === 'price-asc' ? 'active' : ''}
                        aria-label="Ordenar por precio ascendente"
                    >
                        Precio: Menor a Mayor
                    </button>
                    <button
                        onClick={() => setSortOrder('price-desc')}
                        className={sortOrder === 'price-desc' ? 'active' : ''}
                        aria-label="Ordenar por precio descendente"
                    >
                        Precio: Mayor a Menor
                    </button>
                </div>
            </div>

            {/* Mensaje si no hay productos */}
            {totalProducts === 0 && (
                <p className="no-results">No se encontraron productos que coincidan con tu búsqueda o filtros.</p>
            )}

            {/* Grid de Productos Paginados */}
            <div className="products-grid">
                {paginatedProducts.map(product => (
                    // El key debe ser único
                    <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={addToCart}
                    />
                ))}
            </div>

            {/* Controles de Paginación */}
            {totalPages > 1 && (
                <div className="pagination-controls">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Página anterior"
                    >
                        Anterior
                    </button>
                    {renderPaginationControls()}
                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Página siguiente"
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;