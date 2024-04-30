import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import dotenv from 'dotenv';
import cardsData from '../datas/cards.json';
import '../styles/cards.scss';

function Cards({ setProjectDetails, modalOpen }) { // Receive modalOpen prop
    const [jsonData] = useState(cardsData);
    const [projectTitle, setProjectTitle] = useState(''); // Pour stocker le titre du projet cliqué


    useEffect(() => {
        if (!projectTitle) return;  // Ne rien faire si aucun projet n'est sélectionné

        const fetchData = async () => {
            const apiURL = `https://www.nicolasrichelet.dev/htdocs/api/index.php/projects?sqlfilters=title:=:'${projectTitle}'`;
            try {
                const response = await axios.get(apiURL, {
                    headers: { "DOLAPIKEY": process.env.REACT_APP_DOLAPIKEY }
                });
                if (response.data && response.data.length > 0) {
                    setProjectDetails(response.data[0]);  // Assumer que le premier résultat est le bon
                    console.log(response.data[0])
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, [projectTitle]); // Effect déclenché par le changement de selectedProject
    
    const handleCardClick = card => {
        if (card.type === "project") {
            console.log(card.title);
            setProjectTitle(card.title); // Définir le titre qui déclenchera l'appel API
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
