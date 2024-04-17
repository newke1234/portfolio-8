import React, { useState } from 'react'

import projectsData from '../datas/projects.json'
import '../styles/cards.scss'

function Cards() {
    const [jsonData] = useState(projectsData)

  // Vérifiez si l'ID du logement existe dans les données JSON
//   const isProjectIdValid = (id) => jsonData.some((project) => project.id === id)
    return (
        <ul className="cards">
          {jsonData.map((project, id) => (
            <li key={id} className="cards__projects">
                <img
                  className="cards__project__image"
                  src={project.cover}
                  alt={project.title}
                />
                <div className="cards__project__gradient"></div>
                <div className="cards__project__title">{project.title}</div>
            </li>
          ))}
          {/* Si aucun logement n'a été trouvé pour un ID donné, rediriger directement vers la page 404 */}
          {/* {!isProjectIdValid && <Link to="/404" style={{ display: 'none' }} />} */}
        </ul>
      )
}

export default Cards