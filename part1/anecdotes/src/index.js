import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>

const Header = ({text}) => <h1>{text}</h1>

const Anecdote = ({text, votes}) => {
  return (
    <div>
      <p>{text}</p>
      <p>This anecdote has: {votes} votes</p>
    </div>
  )
}

const App = ({anecdotes}) => {
  const [selected, setSelected] = useState(Math.floor(Math.random() * anecdotes.length))
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));
  const mostVotedIndex = votes.indexOf(Math.max(...votes));

  const selectNewAnecdote = () => setSelected(Math.floor(Math.random() * anecdotes.length));
  
  const voteForAnecdote = () => {
    const copy = [...votes];
    copy[selected] += 1;
    setVotes(copy);
  }

  

  return (
    <div>
      <Header text="Anecdote of the day"/>
      <Anecdote text={anecdotes[selected]} votes={votes[selected]}/>
      <Button text="vote" handleClick={voteForAnecdote}/>
      <Button text="next anecdote" handleClick={selectNewAnecdote}/>
      <Header text="Anecdote of the day"/>
      <Anecdote text={anecdotes[mostVotedIndex]} votes={votes[mostVotedIndex]}/>
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)