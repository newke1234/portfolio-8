
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';


function Bio() {
    const [userBio, setUserBio] = useState([]);
    
    useEffect(() => {
        const fetchUserBio = async () => {
            const apiUserBio = `${process.env.REACT_APP_BASEURL}${process.env.REACT_APP_URLAPI}users/2`;
            try {
                const response = await axios.get(apiUserBio, {
                    headers: { "DOLAPIKEY": process.env.REACT_APP_DOLAPIKEY }
                });
                if (response.data) {
                    setUserBio([response.data]); // Wrapping the object in an array
                    if ( response.data.length > 0) {
                        setUserBio(response.data);
                    }
                }
            } catch (error) {
                console.error("Error fetching data for bio: ", error);
            }
        };

        fetchUserBio();
    }, []); 
    
    return (
            <div>
            {userBio.map(bio => (
                <p key={bio.id} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(bio.note_public) }}></p>
            ))}
        </div>
    )};

export default Bio