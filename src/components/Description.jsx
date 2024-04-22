import React from 'react';

function Description({ details }) {
    const getImagePath = (filename) => {
        if (!filename) return '';
        return require(`../assets/images/${filename}`);
    };

    return (
        <div className="description__container">
            <h2>{details.title}</h2>
            <h3>{details.subtitle}</h3>
            <div className="description__container-images">
            {details.pictures && details.pictures.map((picture, index) =>
                picture ? <img key={index} src={getImagePath(picture)} alt={`${details.title} ${index + 1}`} />: null
            )}
            </div> 
            {details.description && details.description.map((desc, index) => (
                <p key={index}>{desc}</p>
            ))}
            <div className="tech-container">
                {details.tech && details.tech.map((techItem, index) => (
                <span className="tech-tags" key={index}>{techItem}</span>
            ))}
            </div>
        </div>
    );
}

export default Description;
