import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Header = ({text}) => <h1>{text}</h1>

const Statistic = ({name, count}) => <tr><td>{name}</td><td>{count}</td></tr>

const Statistics = ({good, bad, neutral}) => {
  if (good+bad+neutral === 0) {
    return (
      <div>No feedback given</div>
    )
  } else {
    return (
      <div>
        <table>
          <tbody>
            <Statistic name="good" count={good}/>
            <Statistic name="neutral" count={neutral}/>
            <Statistic name="bad" count={bad}/>
            <Statistic name="all" count={bad+neutral+good}/>
            <Statistic name="average" count={(good - bad)/(good+bad+neutral)}/>
            <Statistic name="positive" count={`${(good * 100)/(good+bad+neutral)}%`}/>
          </tbody>
        </table>
      </div>
    )
  }
}

const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const createIncrementer = (param, setFunction) => () => setFunction(param + 1); 

  return (
    <div>
      <Header text="give feedback"/>
      <Button handleClick={createIncrementer(good, setGood)} text="good"/>
      <Button handleClick={createIncrementer(neutral, setNeutral)} text="neutral"/>
      <Button handleClick={createIncrementer(bad, setBad)} text="bad"/>
      <Header text="statistics"/>
      <Statistics good={good} bad={bad} neutral={neutral}/>
    </div>
  )

}

ReactDOM.render(<App />, 
  document.getElementById('root')
)