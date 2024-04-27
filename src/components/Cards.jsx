import React, { useState, useEffect } from 'react';
// import cardsData from '../datas/cards.json';
import axios from 'axios';
import '../styles/cards.scss';

const DOLAPIKEY = "242f5d77a5a8a35423df34d2af682419b314a428" // mettre en .env

function Cards({ setProjectDetails, modalOpen }) {
    const [cardsData, setCardsData] = useState([]); // Initialize state to hold fetched data

    // Fetch data from Dolibarr API
    const fetchData = async () => {
        const apiURL = 'https://www.nicolasrichelet.dev/dolibarr/htdocs/api/index.php/cards';
        try {
            const response = await axios.get(apiURL + `?DOLAPIKEY=${DOLAPIKEY}`, {
                // headers: {
                //     'DOLAPIKEY': '242f5d77a5a8a35423df34d2af682419b314a428'
                // }
            });
            setCardsData(response.data); // Store fetched data in state
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    const handleCardClick = card => {
      if (card.type === "project") {
          setProjectDetails({
              title: card.title,
              subtitle: card.subtitle,
              description: card.description,
              pictures: card.pictures || [],
              tech: card.tech
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
