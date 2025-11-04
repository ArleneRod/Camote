import React, { useState } from 'react';
import './ContactPage.css';
import { useToast } from '../context/ToastContext';

const ContactPage = () => {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí es donde enviarías los datos del formulario a un servicio de backend,
        // pero por ahora, solo los mostraremos en la consola para depuración.
        console.log('Datos del formulario de contacto:', formData);

        // NOTA: Reemplazamos 'alert()' por la notificación Toast para una mejor UX.
        showToast('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.', 'success');

        setFormData({ name: '', email: '', message: '' }); // Limpia el formulario
    };

    return (
        <div className="contact-page">
            <h1>Contáctanos</h1>
            <p>¿Tienes alguna pregunta, comentario o sugerencia? ¡Nos encantaría escucharte!</p>
            <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Nombre:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Correo electrónico:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Mensaje:</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="submit-button">Enviar Mensaje</button>
            </form>
        </div>
    );
};

export default ContactPage;