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

  /*   
    {
      correctAnswer: correctAnswer,
      selectedAnswer: selectedAnswer,
    } 
  */
  const [selectedAndCorrect, setSelectedAndCorrect] = useState([]);

  const [startAnotherGame, setStartAnotherGame] = useState(false)

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
          question: question.question,
          answers: shuffle([...question.incorrect_answers, question.correct_answer]),
          correct_answer: question.correct_answer,
          selected: '',
          isChecked: false,
          isCorrect: false
        })
      });

      setQuestions(questArray)
    };

    getQuestions()
  }

  const questionEl = questions.map(question =>
    <Question key={question.id} question={question.question} answers={question.answers} correctAnswer={question.correct_answer} selected={question.selected} checked={question.isChecked} selectAnswer={selectAnswer} isCorrect={question.isCorrect} />
  );

  /**
   * 
   * @param {string} questionSpan 
   * @param {string} correctAnswer 
   */
  function selectAnswer(questionSpan, correctAnswer) {

    let selectedAnswer = event.target.textContent;

    //if the question contain the questionSpan value and the correctAnswer value
    //so the question is the one we want work on.
    //then add to that question the selected value.
    setQuestions(oldQuestion => oldQuestion.map(question => {
      return Object.values(question).indexOf(correctAnswer) > -1 && Object.values(question).indexOf(questionSpan) > -1 ?
        {
          ...question,
          selected: selectedAnswer,
          isCorrect: correctAnswer === selectedAnswer ? true : false
        } :
        question
    }))

    const selectedAndCorrectObj = {
      correctAnswer: correctAnswer,
      selectedAnswer: selectedAnswer,
    };

    //add into new array a key-value of selected answer and correct answer
    setSelectedAndCorrect((oldSelectedAndCorrect) => {
      const updatedArray = [...oldSelectedAndCorrect];
      const index = updatedArray.findIndex((element) => element.correctAnswer === correctAnswer);

      if (index !== -1) {
        // Se esiste già un elemento con la stessa correctAnswer, sostituiscilo
        updatedArray[index] = selectedAndCorrectObj;
      } else {
        // Altrimenti, aggiungi il nuovo oggetto all'array
        updatedArray.push(selectedAndCorrectObj);
      }
      console.log(selectedAndCorrect);

      return updatedArray;

    });
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

      setStartAnotherGame(!startAnotherGame);
    } else if (startAnotherGame) {
      startGame()
      setSelectedAndCorrect([])
      setStartAnotherGame(!startAnotherGame)
    }
  }

  return (
    <>
      <main>
        <div className="container text-center py-5">

          {!questions.length &&
            <StartPage startGame={startGame} />
          }

          {questionEl}

          {selectedAndCorrect.length === 5 &&
            < div className="btn btn_custom btn-primary border-0 rounded-3 px-5 py-2" onClick={checkAnswer}>
              {!startAnotherGame ? "Check answers" : "Start new game"}
            </div>
          }

        </div>
      </main >
    </>
  )
}

export default App