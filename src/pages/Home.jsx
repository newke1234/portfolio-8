import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import Modal from 'react-modal';
import Cards from '../components/Cards';
import Description from '../components/Description';
import Bio from '../components/Bio';  // Import Bio component
import Contact from '../components/Contact';  // Import Contact component
import '../styles/containers.scss';
import '../styles/modal.scss';
import '../styles/description.scss';

Modal.setAppElement('#root'); // Ensure this matches your app structure

/**
 * Home component.
 * Renders the home page of the portfolio.
 */
function Home() {
    const [projectDetails, setProjectDetails] = useState({
        title: "", subtitle: "", description: "", pictures: [], tech: ""
    });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');

    /**
     * Opens the modal with the specified content.
     * @param {string} content - The content to be displayed in the modal ('bio', 'contact', or 'project').
     */
    const openModal = (content) => {
        setModalContent(content);
        setModalIsOpen(true);
    };

    /**
     * Closes the modal.
     */
    const closeModal = () => setModalIsOpen(false);

    /**
     * Handles the click event on a project card.
     * Sets the project details and opens the modal with the project content.
     * @param {object} details - The details of the project.
     */
    const handleProjectClick = (details) => {
        setProjectDetails(details);
        openModal('project');
    };

    return (
        <div>

            <Helmet>
            <title>Nicolas Richelet - Portfolio</title>
            <meta name="description" content="Portfolio de Nicolas Richelet, développeur d'applications web." />
            <meta name="keywords" content="developpeur, Nicolas Richelet, developpeur d'applications, developpeur web, front-end, developpeur javascript, developpeur react, protfolio"/>
            </ Helmet >
        
            <main className='container'>
                <section className='container__head'>
                    <h1 className='container__head-title'>Nicolas Richelet</h1>
                </section>
                <section className="container__middle">
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
                </section>
                <section className='container__down'>
                    <nav className='container__down-main'>
                        <ul>
                            <li onClick={() => openModal('bio')}>01.bio</li>
                            <li onClick={() => openModal('contact')}>02.contact</li>
                        </ul>
                        <div className='container__down-main-job'>Développeur d'Applications Web</div>
                    </nav>
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
                </section>
            </main>
        </div>
    );
}

export default Home;
