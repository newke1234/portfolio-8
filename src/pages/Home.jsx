import Cards from '../components/Cards';
import Divers from '../components/Divers';
import Description from '../components/Description';
import '../styles/containers.scss';
import HiddenCard from '../components/HiddenCard';

function Home() {
    return (
        <div>
            <div className='container'>
                <div className='container__head'>
                    <div><HiddenCard /></div>
                    <div className='container__head-title'>Nicolas Richelet</div>
                    <div><HiddenCard display="visible"/></div>
                </div>
                
                <div className="container__middle">
                    <div className='container__middle-description'>
                        <Description />
                    </div>
                    <div className='container__middle-cards'>
                        <Cards />
                    </div>
                    <div className='container__middle-divers'>
                        <Divers />
                    </div>
                </div>

                <div className='container__down'>
                    <div><HiddenCard /></div>
                    <div className='container__down-main'>
                        <div className='container__down-main-nav'>
                            <ul><li>01.bio</li><li>02.contact</li></ul>
                        </div>
                        <div className='container__down-main-job'>Développeur d'Applications Web</div>
                    </div>
                    <div><HiddenCard /></div>
                </div>
            </div>
        </div>
    )
}

export default Home