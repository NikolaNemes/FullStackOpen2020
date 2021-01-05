import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import combinedReducer from './reducers/combinedReducer'
import thunk from 'redux-thunk'

export default createStore(combinedReducer, composeWithDevTools(applyMiddleware(thunk)))