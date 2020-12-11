import {
    GET_DATA_REQUEST,
    GET_DATA_SUCCESS,
    GET_DATA_ERROR,
    GET_DATA_PICKUP,
    CREATE_PICKUP,
    UPDATE_PICKUP,
    DELETE_PICKUP,
    GET_DATA_PRODUCER,
    GET_DATA_ALL_PRODUCERS,
    GET_DATA_PRODUCER_BY_ID,
    UPDATE_PRODUCER_PROFILE,
    UPDATE_PRODUCER_CONTACT,
    DELETE_PRODUCT,
    UPDATE_PRODUCT,
    CREATE_PRODUCT,
    REGISTRATION_SUCCESS,
    DISABLE_REDIRECTION,
    CLIENT_LOGOUT,
    LOGOUT_ERROR,
    GET_CATEGORIES_SUCCESS,
    GET_CATEGORIES_ERROR,
    // GET_PRODUCERS,
    GET_PRODUCERS_SUCCESS,
    GET_PRODUCERS_ERROR,
    RESET_ERROR,
    SET_ACTIVE_PRODUCER,
    RESET_ACTIVE_PRODUCER,
    GET_API_GEO_SUCCESS,
    GET_API_GEO_ERROR,
    UPDATE_CITY_COORDINATES,
    UPDATE_CIRCLE_RADIUS,
    CREATE_ARTICLE,
    CREATE_ARTICLE_ERROR,
    DELETE_ARTICLE,
    GET_ALL_ARTICLES,
    GET_FAVORITES_PRODUCERS,
    GET_FAVORITES_PRODUCTS,
    GET_MESSAGE_FROM_SERVER,
    GET_UPDATE_CONSUMER_SUCCESS,
    GET_UPDATE_CONSUMER_ERROR,
    GET_PRODUCTS_BY_PRODUCER,
    GET_PRODUCTS_BY_PRODUCER_ID,
    PICTURE_PRODUCER_UPLOAD_ERROR,
    PICTURE_PRODUCER_UPLOAD_SUCCESS,
    UPDATE_TO_KNOW_PRODUCER,
    SUBSCRIBE_TO_PRODUCER,
    SUBSCRIBE_TO_PRODUCT,
    GET_ARTICLES_FOLLOWED,
    GET_FOLLOWERS,
    NBR_PRODUCERS,
    NBR_CONSUMERS,

    //_____MARIE ADMIN ______//

    DELETE_PRODUCER_BY_ID,
    UPDATE_GPS_PRODUCER,
    UPDATE_STATUS_PRODUCER,

    GET_GRADE,
    GET_NEW_GRADE_SUCCESS,
    GET_VOTE_ERROR,
} from "../actions/action";

const firststate = {
    data: [],
    pickupPoint:[],
    productsByProducer:[],
    productsByProducerId:[],
    producerById:[],
    allProducers:[],
    producer: [],
    followers: [],
    allArticles: [],
    ArticlesFollowed: [],
    isLoggedIn : null,
    loading: false,
    subscribe_message: '',
    subscribe_product_message: '',
    error: '',
    redirection: false,
    categories: [],
    producers: [],
    activeProducer: null,
    cities: [],
    circleRadius: 10,
    favoritesProducers :[],
    favoritesProducts:[],
    message:[],
    grade:'',
    vote:'',
};

/**
 * This function specifies how the application's state changes in response to actions sent to the store
 * @param {*} state - the global state of the application
 * @param {*} action - the current action that has been dispatched
 */
export default function Reducer(state = firststate, action = {}) {
    switch(action.type) {
        case GET_DATA_REQUEST:
        return{...state,
            data: [],
            isLoggedIn: null,
            loading: true,
            error: '',
            redirection: false
        }
        case GET_DATA_PICKUP:
            return{...state,
                pickupPoint: action.payload,
                // isLoggedIn: "LOGGED_IN",
                loading: true,
                error: '',
                redirection: false
            }
        case CREATE_PICKUP:
            return{...state
            }
        case UPDATE_PICKUP:
            return{...state
            }
        case DELETE_PICKUP:
            return{...state
            }
        case GET_DATA_PRODUCER:
            return{...state,
                producer: action.payload,
                // isLoggedIn: "LOGGED_IN",
                loading: true,
                error: '',
                redirection: false
            }
        case GET_DATA_ALL_PRODUCERS:
         return{...state,
            allProducers: action.payload,
            // isLoggedIn: "LOGGED_IN",
            loading: true,
            error: '',
            redirection: false
        }
        case DELETE_PRODUCER_BY_ID:
            return{...state
            }
        case UPDATE_GPS_PRODUCER:
            return{...state
            }
        case UPDATE_TO_KNOW_PRODUCER:
            return{...state
            }
        case GET_DATA_PRODUCER_BY_ID:
            return{...state,
                producerById: action.payload,
                // isLoggedIn: "LOGGED_IN",
                loading: true,
                error: '',
                redirection: false
            }
        case GET_PRODUCTS_BY_PRODUCER:
            return{...state,
                productsByProducer: action.payload,
            }
        case GET_PRODUCTS_BY_PRODUCER_ID:
            return{...state,
                productsByProducerId: action.payload,
            }
        case UPDATE_PRODUCER_PROFILE:
            return{...state
            }
        case UPDATE_PRODUCER_CONTACT:
            return{...state
            }
        case UPDATE_STATUS_PRODUCER:
            return{...state
            }
        case DELETE_PRODUCT:
            return{...state
            }
        case UPDATE_PRODUCT:
            return{...state
            }
        case CREATE_PRODUCT:
            return{...state
            }
        case GET_DATA_SUCCESS:
        return{...state,
            data: action.payload,
            isLoggedIn: "LOGGED_IN",
            loading: false,
            error: '',
            redirection: true
        }
        case GET_ALL_ARTICLES:
        return{...state,
            allArticles: action.payload,
            loading: false,
            error: '',
        }
        case CREATE_ARTICLE:
        return{...state,
            createMessage: action.payload,//elo
        }
        
        case CREATE_ARTICLE_ERROR:
        return{...state,
            createError: action.error,
        }

        case DELETE_ARTICLE:
        return{...state
        }
        case SUBSCRIBE_TO_PRODUCER:
        return{...state,
            subscribe_message: action.payload
        }
        case SUBSCRIBE_TO_PRODUCT:
        return{...state,
            subscribe_product_message: action.payload
        }
        case GET_ARTICLES_FOLLOWED:
        return{...state,
            ArticlesFollowed: action.payload
        }
        case GET_FOLLOWERS:
        return{...state,
            followers: action.payload
        }
        case REGISTRATION_SUCCESS:
        return{...state,
            data: [],
            isLoggedIn: null,
            loading: false,
            error: '',
            redirection: true
        }
        case DISABLE_REDIRECTION:
        return{...state,
            redirection: false
        }
        case GET_DATA_ERROR:
        return{...state,
            subscribe_message: '',
            isLoggedIn: null,
            loading: false,
            error: action.error,
            redirection: false
        }
        case LOGOUT_ERROR:
        return{...state,
            loading: false,
            error: action.error,
            redirection: false
        }
        case CLIENT_LOGOUT:
        return{...state,
            data: [],
            isLoggedIn: null,
            loading: false,
            error: '',
            redirection: false,
            cities: []

        }
        case GET_CATEGORIES_SUCCESS:
        return{...state,
            categories: action.payload
        }
        case GET_CATEGORIES_ERROR:
        return{...state,
            error: action.error,
        }
        case GET_PRODUCERS_SUCCESS:
        if (action.payload.length === 0) {
            return{...state,
                producers: [],
                error: "Aucun producteur ne correspond actuellement à votre recherche"
            }
        }
        return{...state,
            producers: action.payload
        }
        case GET_PRODUCERS_ERROR:
        return{...state,
            error: action.error,
        }
        case RESET_ERROR:
        return{...state,
            error: '',
        }
        case SET_ACTIVE_PRODUCER:
        return{...state,
            activeProducer: action.payload
        }
        case RESET_ACTIVE_PRODUCER:
        return{...state,
            activeProducer: null
        }
        case GET_API_GEO_SUCCESS:
        return{...state,
            cities: action.payload,
        }
        case GET_API_GEO_ERROR:
        return{...state,
            error: action.error,
        }
        case UPDATE_CITY_COORDINATES:
        return{...state,
            chosenCity: action.payload,
        }
        case UPDATE_CIRCLE_RADIUS:
        return{...state,
            circleRadius: action.payload,
        }
        case GET_FAVORITES_PRODUCERS:
        return{...state,
            favoritesProducers: action.payload,
            error: '',
        }
        case GET_FAVORITES_PRODUCTS:
        return{...state,
            favoritesProducts: action.payload,
            error: '',
        }
        case GET_MESSAGE_FROM_SERVER:
        return{...state,
            message: action.payload,
            error: '',
        }
        case GET_UPDATE_CONSUMER_SUCCESS:
        return{...state,
            updateSuccess: action.payload,
            error: '',
        }
        case GET_UPDATE_CONSUMER_ERROR:
        return{...state,
            updateError: action.error,
        }
       
        case PICTURE_PRODUCER_UPLOAD_ERROR:
        return{...state,
            error: action.error
        }
        case GET_GRADE:
        return{...state,
            grade : action.payload,
            error : action.error,
        }
        case GET_NEW_GRADE_SUCCESS:
        return{...state,
            vote : action.payload,
            error : action.error,
        }
        case GET_VOTE_ERROR:
        return{...state,
            voteError: action.error,
        }
        case NBR_PRODUCERS:
        return{...state,
            nbrProducers : action.payload,
            error : action.error,
        }

        case NBR_CONSUMERS:
        return{...state,
            nbrConsumers : action.payload,
            error : action.error,
        }

        default:
        return firststate;

    }
}
