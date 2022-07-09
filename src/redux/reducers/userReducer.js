import { FETCH_USER_LOGIN, FETCH_USER_SUCCESS, FETCH_USER_ERROR, USER_LOGOUT, USER_REFRESH } from '../actions/userAction';


const INITIAL_STATE = {

    user: {
        email: '',
        auth: null,
        token: ''
    },
    isLoading: false,
    isError: false

};

const userReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case FETCH_USER_LOGIN:

            return {

                ...state, 
                isLoading: true,
                isError: false

            };

        case FETCH_USER_SUCCESS:
            
            return {
                ...state,
                user: {
                     email: action.payload.email,
                    token: action.payload.token,
                    auth: true
                },
                isLoading: false,
                isError: false
            };

        case FETCH_USER_ERROR:

            return {
                ...state,
                user : {
                    auth: false
                },
                isLoading: false,
                isError: true

            };

        case USER_LOGOUT:

            localStorage.removeItem("email")
            localStorage.removeItem("token")
            return {
                ...state,
                user: {
                    email: '',
                    token: '',
                    auth: false
                },
            }

        case USER_REFRESH:
            return {
                ...state,
                user: {
                    email: localStorage.getItem('email'),
                    token: localStorage.getItem("token"),
                    auth: true
                },
            }

            default: return state;
    }

};

export default userReducer;