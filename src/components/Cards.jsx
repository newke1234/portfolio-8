import React, { useState } from 'react'
import cardsData from '../datas/cards.json'
import '../styles/cards.scss'

function Cards() {
    const [jsonData] = useState(cardsData)

    return (
        <ul className="cards">
          {jsonData.map((card, id) => (
            <li key={id} className="cards__projects">
                {card.type === 'project' && (
                <img
                  className="cards__project__image"
                  src={card.cover}
                  alt={card.title}
                />
                )}
                {/* <div className="cards__project__gradient"></div> */}
                {/* <div className="cards__project__title">{card.title}</div> */}
            </li>
          ))}
          {/* Si aucun projet n'a été trouvé pour un ID donné, rediriger directement vers la page 404 */}
          {/* {!isProjectIdValid && <Link to="/404" style={{ display: 'none' }} />} */}
        </ul>
      )
}

export default Cards