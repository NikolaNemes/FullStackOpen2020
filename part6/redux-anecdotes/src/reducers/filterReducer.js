
export const setFilter = (filter) => {
  return {
    type: 'FILTER',
    filter
  }
}

const reducer = (state = '', action) => {
  console.log('state now: ', state)
  console.log('action', action)
  switch (action.type) {
    case 'FILTER':
      return action.filter
    default: return state
  }
}
  
  export default reducer