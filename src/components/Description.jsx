
import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Component for displaying project description.
 * @param {Object} details - The details of the project.
 * @returns {JSX.Element} The project description component.
 */
function Description({ details }) {
    const [projectPictures, setProjectPictures] = useState([]);
    const [projectTasks, setProjectTasks] = useState([]);
    const [projectTags, setProjectTags] = useState([]);
    
    useEffect(() => {
        /**
         * Fetches project pictures from the API.
         */
        const fetchDataPictures = async () => {
            const apiURLPictures = `${process.env.REACT_APP_BASEURL}${process.env.REACT_APP_URLAPI}documents?modulepart=projet&id=${details.id}`;
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
        /**
         * Fetches project tasks from the API.
         */
        const fetchDataTasks = async () => {
            const apiURLTasks = `${process.env.REACT_APP_BASEURL}${process.env.REACT_APP_URLAPI}tasks?sqlfilters=fk_projet:=:'${details.id}'`;
            try {
                const response = await axios.get(apiURLTasks, {
                    headers: { "DOLAPIKEY": process.env.REACT_APP_DOLAPIKEY }
                });
                if (response.data && response.data.length > 0) {
                    setProjectTasks(response.data);
                }
            } catch (error) {
                console.error("Error fetching data for Tasks: ", error);
            }
        };

        fetchDataTasks();
    }, [details.id]); 

    useEffect(() => {
        /**
         * Fetches project tags from the API.
         */
        const fetchDataTags = async () => {
            const apiURLTags = `${process.env.REACT_APP_BASEURL}${process.env.REACT_APP_URLAPI}categories/object/project/${details.id}`;
            try {
                const response = await axios.get(apiURLTags, {
                    headers: { "DOLAPIKEY": process.env.REACT_APP_DOLAPIKEY }
                });
                if (response.data && response.data.length > 0) {
                    setProjectTags(response.data);
                }
            } catch (error) {
                console.error("Error fetching data for Tasks: ", error);
            }
        };

        fetchDataTags();
    }, [details.id]); 

    return (
        <div className="description-container">
            <div className="description-container__images">
                    {projectPictures && projectPictures.map((picture, index) =>
                <img key={index} src={process.env.REACT_APP_BASEURL + picture.fullname.replace(process.env.REACT_APP_BASEPATH, "")} alt={`${details.title} ${index + 1}`} />
            )}
            </div>
            <div className="description-container__texts">
                <div className="description-container__texts-content">
                    <h2>{details.title}</h2>
                    <h3>{details.description}</h3>
                    
                        {projectTasks && projectTasks.map((task, index) => (
                    <p key={index}>{task.description}</p>
                    
                    ))}
                    <a href = {details.note_public} target="_blank" rel="noopener noreferrer">{details.note_public}</a>
                </div>
                <div className="description-container__texts-tech">
                    {projectTags && projectTags.map((tag, index) => (
                    <span className="tech__tags" key={index}>{tag.label}</span>
                ))}
                </div>
            </div> 
        </div>
    );
}

export default Description;
