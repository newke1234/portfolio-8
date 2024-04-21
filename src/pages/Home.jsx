import React, { useState } from 'react';
import Modal from 'react-modal';
import Cards from '../components/Cards';
import Description from '../components/Description';
import '../styles/containers.scss';
import HiddenCard from '../components/HiddenCard';

Modal.setAppElement('#root');  // Ensure this matches your app structure

function Home() {
    const [projectDetails, setProjectDetails] = useState({
        title: "", subtitle: "", description: "", pictures: [], tech: ""
    });
    const [modalIsOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    // Update project details and open modal
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
                <Cards setProjectDetails={handleProjectClick} />  {/* Pass handleProjectClick */}
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Project Details"
                    style={{
                        content: {
                            position: 'absolute',
                            top: '40px',
                            left: '40px',
                            right: '40px',
                            bottom: '40px',
                            border: '1px solid #ccc',
                            background: '#fff',
                            overflow: 'auto',
                            WebkitOverflowScrolling: 'touch',
                            borderRadius: '4px',
                            outline: 'none',
                            padding: '20px'
                        }
                    }}
                >
                    <Description details={projectDetails} />
                    <button onClick={closeModal}>Close</button>
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
