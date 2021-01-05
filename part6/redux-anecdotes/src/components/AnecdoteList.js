import React from 'react'
import { voteFor } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
import { connect } from 'react-redux'

const AnecdoteList = (props) => {
    const filter = props.filter.toLowerCase()
    const anecdotes = props.anecdotes
        .sort((a, b) => b.votes - a.votes)
        .filter(anecdote => anecdote.content.toLowerCase().includes(filter))

    const onVote = (anecdote) => {
        props.voteFor(anecdote)
        props.setNotification(`You voted '${anecdote.content}'`, 5)
    }

    return (
        <div>
            {anecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => onVote(anecdote)}>vote</button>
                    </div>
                </div>
            )}
        </div>)
}

const mapStateToProps = (state) => {
    return {
        anecdotes: state.anecdotes,
        filter: state.filter
    }
}


const ConnectedAnecdoteList = connect(mapStateToProps, {voteFor, setNotification})(AnecdoteList)

export default ConnectedAnecdoteList