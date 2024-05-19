import React, { useState, useEffect } from 'react';
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
        let contactId;
        let contactExists = true;
    
        try {
            // Check if contact exists
            const contactResponse = await axios.get(`${process.env.REACT_APP_BASEURL}${process.env.REACT_APP_URLAPI}contacts?sortfield=t.email&sortorder=ASC&limit=100&sqlfilters=(t.email:=:'${formData.email}')`, {
                headers: {
                    'DOLAPIKEY': process.env.REACT_APP_DOLAPIKEY, // Your Dolibarr API key
                    'Accept': 'application/json'
                }
            });
            contactId = contactResponse.data[0].id;
            console.log('Contact response', contactResponse.data);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Contact does not exist
                contactExists = false;
                console.log('Contact does not exist', error.response.data);
            } else {
                // Other errors
                console.error('Error while checking contact', error);
            }
        };
    
            
        if (!contactExists) {
            // Create a new contact
            try {
                const newContactResponse = await axios.post(`${process.env.REACT_APP_BASEURL}${process.env.REACT_APP_URLAPI}contacts`, {
                    lastname: formData.name,
                    email: formData.email,
                    // Add other necessary fields according to Dolibarr API
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'DOLAPIKEY': process.env.REACT_APP_DOLAPIKEY, // Your Dolibarr API key
                        'Accept': 'application/json'
                    }
                });
                contactId = newContactResponse.data.id;
                console.log('New contact created successfully', newContactResponse.data);
            } catch (error) {
                console.error('Error while creating new contact', error);
            }
        }
    
            // Create ticket
            const ticketResponse = await axios.post(`${process.env.REACT_APP_BASEURL}${process.env.REACT_APP_URLAPI}tickets`, JSON.stringify({
                fk_socpeople: contactId,
                message: formData.message,
                // Add other necessary fields according to Dolibarr API
            }), {
                headers: {
                    'Content-Type': 'application/json',
                    'DOLAPIKEY': process.env.REACT_APP_DOLAPIKEY, // Your Dolibarr API key
                    'Accept': 'application/json'
                }
            });
            console.log('Ticket created successfully', ticketResponse.data);
    
            // Reset the form after submission
            setFormData({
                name: '',
                email: '',
                message: ''
            });
       
    };
    return (
        <div>
            <h2>Contactez-moi</h2>
            <h3>Laissez-moi un message avec vos coordonnées, je vous recontacterais dans les plus brefs délais.</h3>
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