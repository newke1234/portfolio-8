import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import dotenv from 'dotenv';
import cardsData from '../datas/cards.json';
import '../styles/cards.scss';

function Cards({ setProjectDetails, modalOpen }) { // Receive modalOpen prop
    const [jsonData] = useState(cardsData);
    const [projectTitle, setProjectTitle] = useState('');
    const [triggerFetch, setTriggerFetch] = useState(false); // Ajout d'un trigger pour les fetchs

    useEffect(() => {
        if (!projectTitle) return;  // Ne rien faire si aucun titre de projet n'est sélectionné

        const fetchData = async () => {
            const apiURL = `https://www.nicolasrichelet.dev/htdocs/api/index.php/projects?sqlfilters=title:=:'${projectTitle}'`;
            try {
                const response = await axios.get(apiURL, {
                    headers: { "DOLAPIKEY": process.env.REACT_APP_DOLAPIKEY }
                });
                if (response.data && response.data.length > 0) {
                    setProjectDetails(response.data[0]);  // Assumer que le premier résultat est le bon
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, [projectTitle, triggerFetch]); // Ajout de triggerFetch dans les dépendances

    const handleCardClick = card => {
        if (card.type === "project") {
            console.log(card.title);
            if (projectTitle === card.title) {
                // Si le même titre est cliqué, basculer le trigger pour forcer le re-fetch
                setTriggerFetch(!triggerFetch);
            } else {
                setProjectTitle(card.title); // Définir le titre qui déclenchera l'appel API
            }
        }
    };
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
                    {card.type === 'lang' && (
                        <img src={getImagePath(card.cover)} alt={card.title} />
                    )}
                </li>
            ))}
        </ul>
    );
} 

export default Cards;
