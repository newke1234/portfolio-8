import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cardsData from '../datas/cards.json';
import '../styles/cards.scss';

/**
 * Renders a list of cards representing projects, letters, and technologies.
 * @param {Object} props - The component props.
 * @param {Function} props.setProjectDetails - A function to set the project details.
 * @param {boolean} props.modalOpen - A boolean indicating whether the modal is open.
 * @returns {JSX.Element} The rendered Cards component.
 */
function Cards({ setProjectDetails, modalOpen }) {
    const [jsonData] = useState(cardsData);
    const [projectTitle, setProjectTitle] = useState('');
    const [triggerFetch, setTriggerFetch] = useState(false);

    useEffect(() => {
        if (!projectTitle) return;

        /**
         * Fetches project data from the API based on the selected project title.
         * @returns {void}
         */
        const fetchData = async () => {
            const apiURL = `${process.env.REACT_APP_BASEURL}${process.env.REACT_APP_URLAPI}projects?sqlfilters=title:=:'${projectTitle}'`;
            try {
                const response = await axios.get(apiURL, {
                    headers: { "DOLAPIKEY": process.env.REACT_APP_DOLAPIKEY }
                });
                if (response.data && response.data.length > 0) {
                    setProjectDetails(response.data[0]);
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, [projectTitle, triggerFetch]);

    /**
     * Handles the click event on a card.
     * @param {Object} card - The clicked card object.
     * @returns {void}
     */
    const handleCardClick = card => {
        if (card.type === "project") {
            if (projectTitle === card.title) {
                setTriggerFetch(!triggerFetch);
            } else {
                setProjectTitle(card.title);
            }
        }
    };

    /**
     * Gets the image path for a given filename.
     * @param {string} filename - The filename of the image.
     * @returns {string} The image path.
     */
    const getImagePath = (filename) => {
        if (!filename) return '';
        return require(`../assets/covers/${filename}`);
    };

    return (
        <ul className={`cards ${modalOpen ? 'cards__modal-open' : ''}`}>
            {jsonData.map((card, id) => (
                <li key={id} className="cards__projects" onClick={() => handleCardClick(card)}>
                    {card.type === 'project' && (
                        <img src={getImagePath(card.cover)} alt={card.title} />
                    )}
                    {card.type === 'letter' && (
                        <p className="cards__letter">{card.title}</p>
                    )}
                    {card.type === 'techno' && (
                        <img src={getImagePath(card.cover)} alt={card.title} />
                    )}
                    {card.type === 'myhead' && (
                        <img src={getImagePath(card.cover)} alt={card.title} />
                    )}
                </li>
            ))}
        </ul>
    );
} 

export default Cards;
