import {
    ADD_TODO,
    TOGGLE_TODO,
    SET_VISIBILITY_FILTER,
    VisibilityFilters
} from '../actions/actions';
import {combineReducers} from 'redux';

const {SHOW_ALL} = VisibilityFilters;

function todos(state = [], action) {
    switch (action.type) {
        case ADD_TODO:
            return [
                ...state,
                {
                    text: action.text,
                    completed: false
                }
            ];
        case TOGGLE_TODO:
            return state.map((todo, index) => {
                if (index === action.index) {
                    return Object.assign({}, todo, {
                        completed: !todo.completed
                    })
                }
                return todo
            });
        default:
            return state
    }
}

function visibilityFilter(state = SHOW_ALL, action) {
    if (action.type === SET_VISIBILITY_FILTER) {
        return action.filter;
    } else {
        return state
    }
}

export default function todoApp(state = {}, action) {
    return {
        visibilityFilter: visibilityFilter(state.visibilityFilter, action),
        todos: todos(state.todos, action)
    }
}
