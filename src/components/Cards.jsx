import React, { useState } from 'react';
import cardsData from '../datas/cards.json';
import '../styles/cards.scss';

function Cards({ setProjectDetails }) { // Added prop for setting project details
    const [jsonData] = useState(cardsData);

    const handleCardClick = card => {
      if (card.type === "project") {
          setProjectDetails({
              title: card.title,
              subtitle: card.subtitle,
              description: card.description,
              pictures: card.pictures || [], // S'assure que les images sont incluses, même si elles sont absentes
              tech: card.tech
          });
      }
  };

    const getImagePath = (filename) => {
        if (!filename) return '';
        return require(`../assets/covers/${filename}`);
    };

    return (
        <ul className="cards">
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
                    {card.id === 15 && (<span classname = ""></span>)}
                </li>
            ))}
        </ul>
    );
} 

export default Cards;
