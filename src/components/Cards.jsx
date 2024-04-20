import React, { useState } from 'react'
import cardsData from '../datas/cards.json'
import '../styles/cards.scss'

function Cards() {
    const [jsonData] = useState(cardsData)
    
    const getImagePath = (filename) => {
      if (!filename) return '';
      return require(`../assets/covers/${filename}`);
  };

    return (
        <ul className="cards">
          {jsonData.map((card, id) => (
            <li key={id} className="cards__projects">
                {card.type === 'project' && (
                <img
                  src={getImagePath(card.cover)}
                  alt={card.title}
                />
                )}
                {card.type === 'letter' && (
                <p className="cards__letter">{card.title}</p>
                )}
                {card.type === 'lang' && (
                <img
                src={getImagePath(card.cover)}
                alt={card.title}
                />
                )}
            </li>
          ))}
          {/* Si aucun projet n'a été trouvé pour un ID donné, rediriger directement vers la page 404 */}
          {/* {!isProjectIdValid && <Link to="/404" style={{ display: 'none' }} />} */}
        </ul>
      )
}

export default Cards