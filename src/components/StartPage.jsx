export default function StartPage(props) {
    return (
        <div id="start_page" className="d-flex flex-column align-items-center justify-content-center">
            <h1 className="fw-semibold">Quizzical</h1>
            <p>Answer to all questions</p>

            <div className="btn btn_custom btn-primary border-0 rounded-3 px-5 py-2" onClick={props.startGame}>Start quiz</div>
        </div>
    )
}