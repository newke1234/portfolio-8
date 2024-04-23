import React, { useState } from 'react';
import Modal from 'react-modal';
import Cards from '../components/Cards';
import Description from '../components/Description';
import HiddenCard from '../components/HiddenCard';

import '../styles/containers.scss';
import '../styles/modal.scss';
import '../styles/description.scss';

Modal.setAppElement('#root'); // Ensure this matches your app structure

function Home() {
    const [projectDetails, setProjectDetails] = useState({
        title: "", subtitle: "", description: "", pictures: [], tech: ""
    });
    const [modalIsOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const handleProjectClick = (details) => {
        setProjectDetails(details);
        openModal();
    };

    return (
        <div className='container'>
            <div className='container__head'>
                <HiddenCard />
                <h1 className='container__head-title'>Nicolas Richelet</h1>
                <HiddenCard display="visible"/>
            </div>   
            <div className="container__middle">
                <Cards setProjectDetails={handleProjectClick} modalOpen={modalIsOpen} />
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    className="modal-content"
                    overlayClassName="modal-overlay"
                    contentLabel="Project Details"
                >
                    <Description details={projectDetails} />
                    <button onClick={closeModal} className="close-button" aria-label="Close">X</button>
                </Modal>
            </div>
            <div className='container__down'>
                <HiddenCard />
                <div className='container__down-main'>
                    <ul><li>01.bio</li><li>02.contact</li></ul>
                    <div className='container__down-main-job'>Développeur d'Applications Web</div>
                </div>
                <HiddenCard />
            </div>
        </div>
    );
}

export default Home;
