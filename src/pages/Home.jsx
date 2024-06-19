import React, { useState } from 'react';
import Modal from 'react-modal';
import Cards from '../components/Cards';
import Description from '../components/Description';
import HiddenCard from '../components/HiddenCard';
import Bio from '../components/Bio';  // Import Bio component
import Contact from '../components/Contact';  // Import Contact component
import '../styles/containers.scss';
import '../styles/modal.scss';
import '../styles/description.scss';

Modal.setAppElement('#root'); // Ensure this matches your app structure

function Home() {
    const [projectDetails, setProjectDetails] = useState({
        title: "", subtitle: "", description: "", pictures: [], tech: ""
    });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const openModal = (content) => {
        setModalContent(content); // 'bio', 'contact', or 'project'
        setModalIsOpen(true);
    };
    const closeModal = () => setModalIsOpen(false);

    const handleProjectClick = (details) => {
        setProjectDetails(details);
        openModal('project');
    };

    return (
        <div className='container'>
            <div className='container__head'>
                {/* <HiddenCard /> */}
                <h1 className='container__head-title'>Nicolas Richelet</h1>
                {/* <HiddenCard /> */}
            </div>
            <div className="container__middle">
                <Cards setProjectDetails={handleProjectClick} modalOpen={modalIsOpen} />
                <Modal
                    isOpen={modalIsOpen && modalContent === 'project'}
                    onRequestClose={closeModal}
                    className="modalcontent"
                    overlayClassName="ReactModal__Overlay"
                    contentLabel="Project Details"
                    closeTimeoutMS={200}
                >
                    <Description details={projectDetails} />
                    <button onClick={closeModal} className="close-button">X</button>
                </Modal>
            </div>
            <div className='container__down'>
                {/* <HiddenCard /> */}
                <div className='container__down-main'>
                    <ul>
                        <li onClick={() => openModal('bio')}>01.bio</li>
                        <li onClick={() => openModal('contact')}>02.contact</li>
                    </ul>
                    <div className='container__down-main-job'>Développeur d'Applications Web</div>
                </div>
                <Modal
                    isOpen={modalIsOpen && (modalContent === 'bio' || modalContent === 'contact')}
                    onRequestClose={closeModal}
                    className="modalcontent modalcontent__biocontact"
                    overlayClassName="ReactModal__Overlay"
                    contentLabel={modalContent === 'bio' ? 'Bio' : 'Contact'}
                    closeTimeoutMS={200}
                >
                    {modalContent === 'bio' ? <Bio /> : <Contact />}
                    <button onClick={closeModal} className="close-button">X</button>
                </Modal>
                {/* <HiddenCard /> */}
            </div>
        </div>
    );
}

export default Home;
