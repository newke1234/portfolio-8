import React from 'react';

function Description({ details }) {
    const { title, subtitle, description } = details;
    return (
        <div>
            <h1>{title}</h1>
            <h2>{subtitle}</h2>
            <p>{description}</p>
        </div>
    );
}

export default Description;
