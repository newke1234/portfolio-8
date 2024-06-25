import React, { useState, useCallback } from 'react';
import axios from 'axios';
import '../styles/contact.scss';

/**
 * Composant Contact pour afficher un formulaire de contact et gérer la soumission du formulaire.
 *
 * @component
 * @param {Object} props - Les propriétés du composant
 * @param {Function} props.closeModal - Fonction pour fermer la modale
 * @param {Function} props.openConfirmationModal - Fonction pour ouvrir la modale de confirmation
 * @returns {JSX.Element} Composant Contact
 */
const Contact = ({ closeModal, openConfirmationModal }) => {
    const [formData, setFormData] = useState({
        email: '',
        subject: '',
        message: ''
    });
    const [statusMessage, setStatusMessage] = useState('');

    /**
     * Gère l'événement de changement des entrées du formulaire et met à jour l'état des données du formulaire.
     *
     * @param {Object} e - L'objet événement
     */
    const handleChange = useCallback(e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }, [formData]);

    /**
     * Gère l'événement de soumission du formulaire et envoie une requête POST pour créer un ticket.
     *
     * @param {Object} e - L'objet événement
     */
    const handleSubmit = async e => {
        e.preventDefault();

        try {
            const response = await axios.get(process.env.REACT_APP_LOCAL, {
                params: {
                    action: 'create_ticket',
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                    type_code: 'COM',
                    category_code: 'CTC',
                    severity_code: 'NORMAL'
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            });

            // Nettoyer la réponse pour éviter toute injection de script
            let cleanData = response.data.replace(/<\/?[^>]+(>|$)/g, "");
            console.log('Ticket created successfully', cleanData);

            setStatusMessage('Votre message a été envoyé avec succès.');

            // Réinitialiser le formulaire après la soumission
            setFormData({
                email: '',
                subject: '',
                message: ''
            });

            // Fermer la première modale et ouvrir la modale de confirmation
            closeModal();
            openConfirmationModal();
        } catch (error) {
            console.error('Erreur lors de la création du ticket', error);
            setStatusMessage('Une erreur est survenue. Veuillez réessayer plus tard.');
        }
    };

    return (
        <div className="formpage">
            <h2>Contactez-moi</h2>
            <h3>Laissez-moi un message avec vos coordonnées, je vous recontacterais dans les plus brefs délais.</h3>
            <form onSubmit={handleSubmit}>
                <div className="formpage__element">
                    <label htmlFor="email">Email &gt;&nbsp;</label>
                    <input 
                        className="formpage__element-input"
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="formpage__element">
                    <label htmlFor="subject">Sujet &gt;&nbsp;</label>
                    <input 
                        className="formpage__element-input"
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="formpage__element">
                    <label htmlFor="message">Message &gt; </label>
                    <textarea 
                        className="formpage__element-textarea" 
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button className="formpage__element-button" type="submit">Envoyer</button>
            </form>
            {statusMessage && <p className="formpage__status-message">{statusMessage}</p>}
        </div>
    );
};

export default Contact;
