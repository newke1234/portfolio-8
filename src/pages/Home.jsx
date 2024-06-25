import React, { useState, useCallback } from 'react';
import { Helmet } from "react-helmet";
import Modal from 'react-modal';
import Cards from '../components/Cards';
import Description from '../components/Description';
import Bio from '../components/Bio';
import Contact from '../components/Contact';
import '../styles/containers.scss';
import '../styles/modal.scss';
import '../styles/description.scss';

Modal.setAppElement('#root'); // S'assurer que cela correspond à la structure de votre application

/**
 * Composant Home.
 * Rend la page d'accueil du portfolio.
 */
function Home() {
    const [projectDetails, setProjectDetails] = useState({
        title: "", subtitle: "", description: "", pictures: [], tech: ""
    });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);

    /**
     * Ouvre le modal avec le contenu spécifié.
     * @param {string} content - Le contenu à afficher dans le modal ('bio', 'contact', ou 'project').
     */
    const openModal = useCallback((content) => {
        setModalContent(content);
        setModalIsOpen(true);
    }, []);

    /**
     * Ferme le modal.
     */
    const closeModal = useCallback(() => setModalIsOpen(false), []);

    /**
     * Ouvre le modal de confirmation.
     */
    const openConfirmationModal = useCallback(() => setConfirmationModalIsOpen(true), []);

    /**
     * Ferme le modal de confirmation.
     */
    const closeConfirmationModal = useCallback(() => setConfirmationModalIsOpen(false), []);

    /**
     * Gère l'événement de clic sur une carte de projet.
     * Définit les détails du projet et ouvre le modal avec le contenu du projet.
     * @param {object} details - Les détails du projet.
     */
    const handleProjectClick = useCallback((details) => {
        setProjectDetails(details);
        openModal('project');
    }, [openModal]);

    return (
        <div>
            <Helmet>
                <title>Nicolas Richelet - Portfolio</title>
                <meta name="description" content="Portfolio de Nicolas Richelet, développeur d'applications web." />
                <meta name="keywords" content="developpeur, Nicolas Richelet, developpeur d'applications, developpeur web, front-end, developpeur javascript, developpeur react, portfolio" />
            </Helmet>

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
                        <button onClick={closeModal} className="close-button" aria-label="Close Project Details">X</button>
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
                        {modalContent === 'bio' ? <Bio /> : <Contact closeModal={closeModal} openConfirmationModal={openConfirmationModal} />}
                        <button onClick={closeModal} className="close-button" aria-label="Close Bio or Contact">X</button>
                    </Modal>
                </section>
            </main>
            <Modal
                isOpen={confirmationModalIsOpen}
                onRequestClose={closeConfirmationModal}
                className="modalcontent modalcontent__confirmation"
                overlayClassName="ReactModal__Overlay"
                contentLabel="Confirmation"
                closeTimeoutMS={200}
            >
                <div>
                    <h2>Message envoyé</h2>
                    <p>Votre message a été envoyé avec succès.</p>
                    <button onClick={closeConfirmationModal} className="close-button" aria-label="Close Confirmation">X</button>
                </div>
            </Modal>
        </div>
    );
}

export default Home;
