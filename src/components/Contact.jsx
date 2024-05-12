import React, { useState } from 'react';
import axios from 'axios';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const response = await axios.post('URL_DE_VOTRE_API', formData);
            console.log('Message envoyé avec succès', response.data);
            // Réinitialiser le formulaire après l'envoi
            setFormData({
                name: '',
                email: '',
                message: ''
            });
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message', error);
        }
    };

    return (
        <div>
            <h2>Contactez-moi</h2>
            <h3>Laissez nous un message avec vos coordonnées, nous vous recontactons dans les plus brefs délais.</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Nom:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="message">Message:</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Envoyer</button>
            </form>
        </div>
    );
};

export default Contact;