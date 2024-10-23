import { combineReducers } from 'redux'

// const users = (state = []) => state

// const cars = (state = [], action) => {
//     switch(action.type) {
//         case 'ADD_CAR':
//             return [ ...state, action.value ]
//         case 'REMOVE_CAR':
//             const cars = [ ...state ]
//             cars.splice(action.value, 1)
//             return cars
//         default:
//             return state
//     }
// }

const users = (state = [], action) => {
    switch(action.type) {
        case 'FETCH_USERS':
            return action.value
        case 'ADD_USER':
          return [ ...state, action.value ]
        default:
            return state
    }
}

export default combineReducers({ users })