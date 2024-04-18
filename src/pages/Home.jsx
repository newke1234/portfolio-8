import Cards from '../components/Cards';
import '../styles/containers.scss';

function Home() {
    return (
        <div className='container-main'>
            <div className='container-description'>
                <p>test</p>
            </div>
            <div className='container-cards'>
                <Cards />
            </div>
            <div className='container-contact'>
                <p>test</p>
            </div>
        </div>
    )
}

export default Home