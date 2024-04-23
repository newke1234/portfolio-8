import React, { useState } from 'react';
import cardsData from '../datas/cards.json';
import '../styles/cards.scss';

function Cards({ setProjectDetails, modalOpen }) { // Receive modalOpen prop
    const [jsonData] = useState(cardsData);

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
