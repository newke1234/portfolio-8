import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/cards.scss';

const DOLAPIKEY = "ogjvDqFiS1B5WJ32hi440rC6DzBf1KY6"; // This should be in .env for security

function Cards({ setProjectDetails, modalOpen }) {
    const totalCubes = 36;
    const placeholderData = Array(totalCubes).fill({ cardtype: 'placeholder' });
    const [cardsData, setCardsData] = useState(placeholderData); // Initialize with placeholders

    // Fetch data from Dolibarr API
    const fetchData = async () => {
        const apiURL = 'http://localhost/dolibarr/htdocs/api/index.php/devportfolioapi/cards';
        try {
            const response = await axios.get(`${apiURL}?DOLAPIKEY=${DOLAPIKEY}`);
            if (response.data && response.data.length > 0) {
                const mergedData = response.data.concat(placeholderData.slice(response.data.length, totalCubes));
                setCardsData(mergedData); // Merge data with placeholders to ensure total remains 36
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };
    
    useEffect(() => {
        fetchData();
        console.log({cardsData});
    });

    const handleCardClick = card => {
      if (card.cardtype === "project") {
          setProjectDetails({
              title: card.title,
              subtitle: card.subtitle,
              descriptions: card.descriptions,
              pictures: card.pictures || [],
              technos: card.technos
          });
      }
    };

    const getImagePath = (filename) => {
        if (!filename) return '';
        return require(`../assets/covers/${filename}`);
    };

    return (
        <ul className={`cards ${modalOpen ? 'cards__modal-open' : ''}`}>
            {cardsData.map((card, id) => (
               
                <li key={id} className="cards__projects" onClick={() => handleCardClick(card)}>
              
                    {card.cardtype === 'placeholder' && (
                        <div className="card__placeHolder">
                            Placeholder
                        </div>
                    )}
                    {card.cardtype === 'project' && (
                        <div>
                           <img src={getImagePath(card.cover)} alt={card.title} />
                        </div>
                    )}
                    {card.cardtype === 'letter' && (
                        <p className="cards__letter">{card.title}</p>
                    )}
                    {card.cardtype === 'lang' && (
                        <img src={getImagePath(card.cover)} alt={card.title} />
                    )}
                </li>
            ))}
        </ul>
    );
} 

export default Cards;
