import { LOCATION_CHANGE } from './actions'

/**
 * Adds query to location.
 * Utilises the search prop of location to construct query.
 */
const injectQuery = (location) => {
  const searchQuery = location && location.search

  if (typeof searchQuery !== 'string' || searchQuery.length === 0) {
    return {
      ...location,
      query: {}
    }
  }

  // Get search params from search string
  const search = new URLSearchParams(searchQuery)
  // Construct query object from search params
  const query = Object.fromEntries(search)

  return {
    ...location,
    query
  }
}

const createConnectRouter = (structure) => {
  const {
    fromJS,
    merge,
  } = structure

  const createRouterReducer = (history) => {
    const initialRouterState = fromJS({
      location: injectQuery(history.location),
      action: history.action,
    })

    /*
    * This reducer will update the state with the most recent location history
    * has transitioned to.
    */
    return (state = initialRouterState, { type, payload } = {}) => {
      if (type === LOCATION_CHANGE) {
        const { location, action, isFirstRendering } = payload
        // Don't update the state ref for the first rendering
        // to prevent the double-rendering issue on initilization
        return isFirstRendering
          ? state
          : merge(state, { location: fromJS(injectQuery(location)), action })
      }

      return state
    }
  }

  return createRouterReducer
}

export default createConnectRouter
