export const setNotification = (notification, time) => {
    return async dispatch => {
        const id = (100000 * Math.random()).toFixed(0)
        dispatch({
            type: 'NOTIFY',
            data: {
                id,
                notification
            }
            
        })
        const sleep = m => new Promise(r => setTimeout(r, m))
        await sleep(time * 1000)
        dispatch({
            type: 'REMOVE',
            id
        })
    }
}

const reducer = (state = '', action) => {
    console.log('state now: ', state)
    console.log('action', action)
    switch (action.type) {
      case 'NOTIFY':
        return action.data
      case 'REMOVE':
          return action.id === state.id ? {id: -1, notification: ''} : {...state}
      default: return state
    }
  }
  
  export default reducer