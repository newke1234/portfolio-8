import '../styles/cards.scss'

function HiddenCard({display}) {
    return (
        <div className={`hiddenCard ${display}`}>
            {display === 'visible' && (
                <span>O</span>
            )}
        </div>
    )
}

export default HiddenCard