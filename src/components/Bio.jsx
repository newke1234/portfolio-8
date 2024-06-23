
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';

/**
 * Component for displaying user bio.
 * @component
 */
function Bio() {
    const [userBio, setUserBio] = useState([]);

    /**
     * Fetches user bio data from the API.
     * @async
     */
    useEffect(() => {
        const fetchUserBio = async () => {
            const apiUserBio = `${process.env.REACT_APP_BASEURL}${process.env.REACT_APP_URLAPI}users/${process.env.REACT_APP_USERID}`;
            try {
                const response = await axios.get(apiUserBio, {
                    headers: { "DOLAPIKEY": process.env.REACT_APP_DOLAPIKEY }
                });
                if (response.data) {
                    setUserBio([response.data]);
                    if (response.data.length > 0) {
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
    );
}

export default Bio;
