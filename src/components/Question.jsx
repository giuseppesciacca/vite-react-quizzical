import { nanoid } from "nanoid";

export default function Question(props) {

    /**
    * 
    * @returns class css for background span answer
    */
    function colorAnswer(answer) {
        if ((props.correctAnswer == answer) && props.isChecked) {
            return "correct_answer"
        } else if (props.selected == answer && (props.isChecked && !props.isCorrect)) {
            return "wrong_answer"
        } else if (props.selected == answer) {
            return "answer_selected"
        } else if ((props.isChecked && !props.isCorrect) || (props.isChecked && props.isCorrect)) {
            return "not_selected_after_check"
        }
    }

    const answerEl = props.answers.map(answer => {
        const id = nanoid();

        return (
            <div
                key={id}
                onClick={() => props.selectAnswer(props.question, props.correctAnswer, props.isChecked)}
                className={`col-10 col-sm-6 col-md-4 col-lg-2 btn_answer mx-3 p-1 rounded-4 text-center ${colorAnswer(answer)}`}>

                {props.decodeHtmlEntities(answer)}

            </div >
        )
    });

    return (
        <div id="questions" className="pb-4 text-start">

            <div className="container">
                <h5 className="col-12 mb-4 fw-semibold">{props.question}</h5>

                <div className="row align-items-center justify-content-around g-3 pb-3">
                    {answerEl}
                </div>
            </div>

            <hr />
        </div>
    )
}