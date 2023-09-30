import { nanoid } from "nanoid";

export default function Question(props) {

    console.log(props);

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
        }
    }

    const answerEl = props.answers.map(answer => {
        const id = nanoid();

        return (
            <span
                key={id}
                onClick={() => props.selectAnswer(props.question, props.correctAnswer, props.isChecked)}
                className={`btn_answer mx-3 px-3 p-1 rounded-4 ${colorAnswer(answer)}`}>
                {answer}
            </span >
        )
    });

    return (
        <div id="questions" className=" pb-4 text-start">
            <h5 className="mb-3 fw-semibold">{props.question}</h5>

            <div className="d-flex align-items-center justify-content-around  pb-3">
                {answerEl}
            </div>

            <hr />
        </div>
    )
}