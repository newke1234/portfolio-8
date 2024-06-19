import React, { useState } from 'react';
import axios from 'axios';
import '../styles/contact.scss';

const Contact = () => {
    const [formData, setFormData] = useState({
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
            let cleanData = response.data.replace(/<\/?[^>]+(>|$)/g, "");
            console.log('Ticket created successfully', cleanData);
    
            // Reset the form after submission
            setFormData({
                email: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            console.error('Error while creating ticket', error);
        }
    };
    return (
        <div className="formpage">
            <h2>Contactez-moi</h2>
            <h3>Laissez-moi un message avec vos coordonnées, je vous recontacterais dans les plus brefs délais.</h3>
            <form onSubmit={handleSubmit}>
                <div className="formpage__element">
                    <label htmlFor="email">Email &gt;&nbsp;</label>
                    <input className="formpage__element-input"
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
                    <input className="formpage__element-input"
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
                    <textarea className="formpage__element-textarea" 
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button className="formpage__element-button" type="submit">Envoyer</button>
            </form>
        </div>
    );
};

export default Contact;