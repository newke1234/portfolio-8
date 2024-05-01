
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Description({ details }) {
    const [projectPictures, setProjectPictures] = useState([]);
    
    useEffect(() => {
        const fetchDataPictures = async () => {
            const apiURLPictures = `https://www.nicolasrichelet.dev/htdocs/api/index.php/documents?modulepart=projet&id=${details.id}`;
            try {
                const response = await axios.get(apiURLPictures, {
                    headers: { "DOLAPIKEY": process.env.REACT_APP_DOLAPIKEY }
                });
                if (response.data && response.data.length > 0) {
                    setProjectPictures(response.data);
                }
            } catch (error) {
                console.error("Error fetching data for Pictures: ", error);
            }
        };

        fetchDataPictures();
    }, [details.id]); 

    useEffect(() => {
        console.log(process.env.REACT_APP_BASEPATH); 
    }, [projectPictures]);

    return (
        <div className="description__container">
            <h2>{details.title}</h2>
            <h3>{details.description}</h3>
            <div className="description__container-images">
                    {projectPictures && projectPictures.map((picture, index) =>
                  
                <img key={index} src={process.env.REACT_APP_BASEURL + picture.fullname.replace(process.env.REACT_APP_BASEPATH, "")} alt={`${details.title} ${index + 1}`} />
               
            )}
            </div> 
            {/* {details.description && details.description.map((desc, index) => (
                <p key={index}>{desc}</p>
            ))}
            <div className="tech">
                {details.tech && details.tech.map((techItem, index) => (
                <span className="tech__tags" key={index}>{techItem}</span>
            ))}
            </div> */}
        </div>
    );
}

export default Description;
