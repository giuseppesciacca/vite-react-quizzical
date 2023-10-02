import { useState } from "react";
import { nanoid } from "nanoid";
import StartPage from "./components/StartPage";
import Question from "./components/Question";

function App() {

  /*   
    {
      //custom object question
      id: nanoid(),
      question: question,
      answers: shuffle([...incorrect_answers, correct_answer]),
      correct_answer: correct_answer,
      selected: '',
      isChecked: false,
      isCorrect: false
    } 
  */
  const [questions, setQuestions] = useState([]);

  const [startAnotherGame, setStartAnotherGame] = useState(false);

  const [numQuestionChecked, setNumQuestionChecked] = useState(0);

  const [numCorrectAnswer, setNumCorrectAnswer] = useState(0);

  /**
   * populate array questions
   */
  function startGame() {
    const url = 'https://opentdb.com/api.php?amount=5';

    async function getQuestions() {
      const res = await fetch(url)
      const data = await res.json()
      const questArray = [];

      /**
       * 
       * @param {Array} array 
       * @returns shuffled array
       */
      const shuffle = (array) => {

        function randIndex() {
          return Math.random() - 0.5
        }

        array.sort(randIndex);

        return array
      };

      data.results.forEach(question => {
        questArray.push({
          //custom object question
          id: nanoid(),
          question: decodeHtmlEntities(question.question),
          answers: shuffle([...question.incorrect_answers, question.correct_answer]),
          correct_answer: question.correct_answer,
          selected: "",
          isChecked: false,
          isCorrect: false
        })
      });

      setQuestions(questArray)
    };

    getQuestions()
  }

  /**
   * 
   * @param {string} question 
   * @returns 
   */
  function decodeHtmlEntities(question) {

    let txt = document.createElement("textarea");

    txt.innerHTML = question;

    return txt.value;
  }

  const questionEl = questions.map(question =>
    <Question
      key={question.id}
      question={question.question}
      answers={question.answers}
      correctAnswer={question.correct_answer}
      selected={question.selected}
      isChecked={question.isChecked}
      selectAnswer={selectAnswer}
      isCorrect={question.isCorrect}
      decodeHtmlEntities={decodeHtmlEntities} />
  );

  /**
   * 
   * @param {string} questionSpan 
   * @param {string} correctAnswer 
   */
  function selectAnswer(questionSpan, correctAnswer, isChecked) {

    if (!isChecked) {
      let selectedAnswer = event.target.textContent;

      //if the question contain the questionSpan value and the correctAnswer value
      //so the question is the one we want work on.
      //then add to that question the "selected" value.
      setQuestions(oldQuestion => oldQuestion.map(question => {
        return Object.values(question).indexOf(correctAnswer) > -1 && Object.values(question).indexOf(questionSpan) > -1 ?
          {
            ...question,
            selected: selectedAnswer,
            isCorrect: correctAnswer === selectedAnswer ? true : false
          } :
          question
      }))

      /* if this question have selected === "" (so it's not selected yet), add +1 to numQuestionChecked */
      questions.map(question => {
        return (Object.values(question).indexOf(correctAnswer) > -1 && Object.values(question).indexOf(questionSpan) > -1 && question.selected === "") && setNumQuestionChecked(oldNumQuestionChecked => oldNumQuestionChecked + 1);
      });
    }
  }

  /**
   * 
   */
  function checkAnswer() {
    if (!startAnotherGame) {
      setQuestions(oldQuestion =>
        oldQuestion.map(question => {
          return (
            {
              ...question,
              isChecked: true
            })
        }))

      // every choice, check if is correct
      questions.forEach(question => {
        if (question.isCorrect) {
          setNumCorrectAnswer(numCorrectAnswer => numCorrectAnswer + 1)
        }
      });

      //if we selcted all questions
      setStartAnotherGame(!startAnotherGame);

    } else if (startAnotherGame) {

      startGame()
      setNumQuestionChecked(0)
      setNumCorrectAnswer(0)
      setStartAnotherGame(!startAnotherGame)
    }
  }

  return (
    <>
      <main>
        <div className="container-fluid text-center py-5">

          {!questions.length &&
            <StartPage startGame={startGame} />
          }

          {questionEl}

          {startAnotherGame &&
            <div className="d-inline me-3 fw-bold fs-5">
              {"You scored " + numCorrectAnswer + "/" + questions.length + " correct answers"}
            </div>
          }

          {numQuestionChecked === 5 &&
            < div className="btn btn_custom border-0 rounded-4 px-5 py-2 fw-semibold text-white" onClick={checkAnswer}>

              {!startAnotherGame ? "Check answers" : "Play again"}
            </div>
          }
        </div>
      </main >
    </>
  )
}

export default App