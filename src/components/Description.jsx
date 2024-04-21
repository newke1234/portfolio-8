import React from 'react';

function Description({ details }) {
    const getImagePath = (filename) => {
        if (!filename) return '';
        return require(`../assets/images/${filename}`);
    };

    return (
        <div className="description-container">
            <h2>{details.title}</h2>
            <h3>{details.subtitle}</h3>
            {details.pictures && details.pictures.map((picture, index) =>
                picture ? <div className="description-container-images"><img key={index} src={getImagePath(picture)} alt={`${details.title} ${index + 1}`} /></div> : null
            )}
            {details.description && details.description.map((desc, index) => (
                <p key={index}>{desc}</p>
            ))}
            <p className="inverse">{details.tech}</p>
            
        </div>
    );
}

export default Description;
