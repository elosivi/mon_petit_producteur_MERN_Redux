import axios from "axios";
// import * as actions from "./action";
// import * from "./action";
import {

  GET_UPDATE_CONSUMER_SUCCESS,
  GET_UPDATE_CONSUMER_ERROR,
  PICTURE_PRODUCER_UPLOAD_ERROR,

    GET_DATA_SUCCESS,
    GET_DATA_ERROR,
    REGISTRATION_SUCCESS,
    DISABLE_REDIRECTION,
    CLIENT_LOGOUT,
    LOGOUT_ERROR,
    GET_CATEGORIES_SUCCESS,
    GET_CATEGORIES_ERROR,
    GET_PRODUCERS_SUCCESS,
    GET_PRODUCERS_ERROR,
    UPDATE_PRODUCER_CONTACT,
    RESET_ERROR,
    SET_ACTIVE_PRODUCER,
    RESET_ACTIVE_PRODUCER,
    GET_API_GEO_ERROR,
    GET_API_GEO_SUCCESS,
    GET_CITY_SUCCESS,
    GET_CITY_ERROR,
    UPDATE_CITY_COORDINATES,
    UPDATE_CIRCLE_RADIUS,
    UPDATE_PRODUCT,
    CREATE_PRODUCT,
    DELETE_PRODUCT,
    CREATE_PICKUP,
    UPDATE_PICKUP,
    DELETE_PICKUP,
    GET_DATA_PRODUCER,
    GET_DATA_ALL_PRODUCERS,
    GET_DATA_PRODUCER_BY_ID,
    UPDATE_PRODUCER_PROFILE,
    GET_DATA_PICKUP,
    CREATE_ARTICLE,
    CREATE_ARTICLE_ERROR,
    DELETE_ARTICLE,
    GET_ALL_ARTICLES,
    GET_PRODUCERS,
    GET_FAVORITES_PRODUCERS,
    GET_FAVORITES_PRODUCTS,
    GET_ARTICLES_FOLLOWED,
    SUBSCRIBE_TO_PRODUCER,
    SUBSCRIBE_TO_PRODUCT,
    GET_MESSAGE_FROM_SERVER,
    GET_PRODUCTS_BY_PRODUCER,
    GET_PRODUCTS_BY_PRODUCER_ID,
    GET_FOLLOWERS,
    NBR_PRODUCERS,
    NBR_CONSUMERS,

    //_________ MARIE ADMIN ________//

    DELETE_PRODUCER_BY_ID,
    UPDATE_GPS_PRODUCER,
    UPDATE_STATUS_PRODUCER,
    UPDATE_TO_KNOW_PRODUCER,

    GET_GRADE,
    GET_NEW_GRADE_SUCCESS,
    GET_VOTE_ERROR,
} from "./action"

import {SERVER_URL} from "../containers/BaseUrl";

const instance = axios.create({
  withCredentials: true,
  baseURL: SERVER_URL,
})

const API_GEO_BASE_URL = "https://geo.api.gouv.fr";

/**
 * This method is used to save data in database from user who logged in with google oauth
 * @param  {String} name the consumer google login
 * @param  {String} email the consumer google email
 * @return {*} Dispatch
 */
export const SaveGoogleData = (name, email) => {
  return dispatch => {
    instance
      .post('oauth/login', {
        email: email,
        login: name,
        password: "null" // No password is sent to server with Google Auth
      })
      .then(res => {
        dispatch({
          type: GET_DATA_SUCCESS,
          payload: res.data
        });
      })
      .catch(error => {
        dispatch({
          type: GET_DATA_ERROR,
          payload: ''
        });
      });
  };
};

/**
 * This method is used to authentified a local consumer
 * @param  {String} login the consumer login
 * @param  {String} password the consumer password
 * @return {*} Dispatch
 */
export const LocalLogin = (login, password) => {
  return dispatch => {
    instance
      .post("auth/login",
          {
            login: login,
            password: password,
          }
        )
        .then(res => {
          // console.log(res.data);
          dispatch({
            type: GET_DATA_SUCCESS,
            payload: res.data
          });
        })
        .catch(error => {
          let errorMessage = "";
          if (error.response) {
            errorMessage = "Identifiants erronés";
            console.log(error.response);
          } else {
            errorMessage = "Un problème est survenu...";
          }
          dispatch({
            type: GET_DATA_ERROR,
            payload: '',
            error: errorMessage
          });
        });
    }
}

/**
 * This method is used to authentified a producer
 * @param  {String} login the producer login
 * @param  {String} password the producer password
 * @return {*} Dispatch
 */
export const Login_as_Producer = (login, password) => {
  return dispatch => {
    instance
      .post("auth/producersLogin",
          {
            login: login,
            password: password,
          }
        )
        .then(res => {
          // console.log(res.data);
          dispatch({
            type: GET_DATA_SUCCESS,
            payload: res.data
          });
        })
        .catch(error => {
          let errorMessage = "";
          if (error.response) {
            errorMessage = "Identifiants erronés";
            console.log(error.response);
          } else {
            errorMessage = "Un problème est survenu...";
          }
          dispatch({
            type: GET_DATA_ERROR,
            payload: '',
            error: errorMessage
          });
        });
    }
}

/**
 * This method is used to logout
 * @return {*} Dispatch
 */
export const Logout = () => {
  return dispatch => {
    instance
      .get("auth/logout")
        .then(res => {
          dispatch({
            type: CLIENT_LOGOUT
          });
        })
        .catch(error => {
          dispatch({
            type: LOGOUT_ERROR,
            payload: '',
            error: "Déconnexion impossible"
          });
        });
    }
}

/**
 * This method is used to register a consumer
 * @param  {String} login the consumer login
 * @param  {String} email the consumer email
 * @param  {Number} zip_code the consumer zip_code
 * @param  {String} password the consumer password
 * @param  {String} password_confirmation the consumer password_confirmation
 * @return {*} Dispatch
 */
export const Register = (login, email, zip_code, password, password_confirmation) => {
  return dispatch => {
    instance
      .post("auth/register",
          {
            login: login,
            email: email,
            zip_code : zip_code,
            password: password,
            password_confirmation: password_confirmation
          }
        )
        .then(res => {
          // console.log(res.data);
          dispatch({
            type: REGISTRATION_SUCCESS,
            payload: res.data,
          });
        })
        .catch(error => {
          let errorMessage = "";
          if (error.response) {
            errorMessage = error.response.data.message;
            console.log("error.response >>>", error.response);
          } else {
            errorMessage = "Un problème est survenu...";
          }
          dispatch({
            type: GET_DATA_ERROR,
            payload: '',
            error: errorMessage
          });
        });
    }
}

/**
 * This method is used to register a producer
 * @param  {String} login the producer login
 * @param  {String} farmName the producer farm Name
 * @param  {String} email the producer email
 * @param  {String} phone the producer phone
 * @param  {String} producerPresentation the producer presentation
 * @param  {String} farmPresentation the producer farm Presentation
 * @param  {String} productsPresentation the producer products presentations
 * @param  {String} address the producer address
 * @param  {Number} zipCode the producer zip_code
 * @param  {String} city the producer city
 * @param  {Array} gpsCoordinates the producer gps coordinates
 * @param  {String} password the producer password
 * @param  {String} password_confirmation the producer password_confirmation
 * @return {*} Dispatch
 */
export const RegisterProducer = (login, farmName, email, phone, producerPresentation, farmPresentation, productsPresentation, address, zipCode, city, gpsCoordinates, password, password_confirmation) => {
  return dispatch => {
    instance
      .post("auth/register_producers",
          {
            login: login,
            farmName: farmName,
            email: email,
            phone: phone,
            producerPresentation: producerPresentation,
            farmPresentation: farmPresentation,
            productsPresentation: productsPresentation,
            address: address,
            zipCode: zipCode,
            city: city,
            gpsCoordinates: gpsCoordinates,
            password: password,
            password_confirmation: password_confirmation
          }
        )
        .then(res => {
          // console.log(res.data);
          dispatch({
            type: REGISTRATION_SUCCESS,
            payload: res.data,
          });
        })
        .catch(error => {
          let errorMessage = "";
          if (error.response) {
            errorMessage = error.response.data.message;
            console.log("error.response >>>", error.response);
          } else {
            errorMessage = "Un problème est survenu...";
          }
          dispatch({
            type: GET_DATA_ERROR,
            payload: '',
            error: errorMessage
          });
        });
    }
}

/**
 * This method is used to check if someone is logged in after a refresh
 * @return {*} Dispatch
 */
export const CheckAuth = () => {
  console.log(" -------> New request to checkAuth... <-------")
  return dispatch => {
    instance
      .get("auth/me")
        .then(res => {
          console.log("CheckAuth request is Ok");
          dispatch({
            type: GET_DATA_SUCCESS,
            payload: res.data
          });
        })
        .catch(error => {
          console.log("Error from CheckAuth request ", error);
          dispatch({
            type: GET_DATA_ERROR,
            payload: ''
          });
        });
    }
}

//=======================================================================================================================================
//                                              A R T I C L E S     R E Q U E S T S
//=======================================================================================================================================

/**
 * This method is used to create an article
 * @param  {String} author producer login
 * @param  {ObjectId} author_id producer id
 * @param  {String} title title of the article created
 * @param  {String} content content of the article created
 * @return {*} Dispatch
 */
export const PostArticles = (author, author_id, title, content) => {
  console.log(" --------REQUEST ----- PostArticle------")
  return dispatch => {
    instance
      .post("articles/create",
      {
        author: author,
        author_id: author_id,
        title: title,
        content: content
      })
        .then(res => {
          // console.log( "* REQUEST create article --->", res.data);//test
          dispatch({
            type: CREATE_ARTICLE,
            payload: res.data
          });
          instance
            .get("articles/readall")
              .then(res => {
                // console.log(" REQUEST readall res.data:", res.data.data);
                dispatch({
                  type: GET_ALL_ARTICLES,
                  payload: res.data.data
                });
              })
              .catch(error => {
                console.log(" REQUEST error1: ",error)
                dispatch({
                  type: GET_DATA_ERROR,
                  error: error.data
                });
              });
          })
        .catch(error => {
          console.log(" REQUEST error2.response: ",error.response.data.message)
          dispatch({
            type: CREATE_ARTICLE_ERROR,
            error: error.response.data.message,
            payload:"",
          });
        });
    }
}


/**
 * This method is used to get all articles present in DBB.
 * @return {*} Dispatch
 */
export const GetAllArticles = () => {
  return dispatch => {
    instance
      .get("articles/readall")
        .then(res => {
          // console.log(res.data.data);
          dispatch({
            type: GET_ALL_ARTICLES,
            payload: res.data.data
          });
        })
        .catch(error => {
          dispatch({
            type: GET_DATA_ERROR,
            error: error.data
          });
        });
    }
}

/**
 * This method is used to get all articles from one producer using its id.
 * @param {ObjectId} author_id producer id who posted the article
 * @return {*} Dispatch
 */
export const GetAllArticlesByAuthor = (author_id) => {
  return dispatch => {
    instance
      .get("articles/readall/" + author_id)
        .then(res => {
          // console.log(res.data.data);
          dispatch({
            type: GET_ALL_ARTICLES,
            payload: res.data.data
          });
        })
        .catch(error => {
          dispatch({
            type: GET_DATA_ERROR,
            error: error.data
          });
        });
    }
}


/**
 * This method is used to get all articles from followed producers on the consumer side
 * @param {ObjectId} _id consumer id
 * @return {*} Dispatch
 */
export const GetAllArticlesFollowed = (_id) => {
  return dispatch => {
    instance
      .get("articles/get_mess/" + _id)
        .then(res => {
          // console.log(res.data);
          dispatch({
            type: GET_ARTICLES_FOLLOWED,
            payload: res.data
          });
        })
        .catch(error => {
          dispatch({
            type: GET_DATA_ERROR,
            error: error.data
          });
        });
    }
}

/**
 * This method is used to delete an article posted by a specific producer
 * @param  {ObjectId} post_id article id
 * @param  {ObjectId} author_id producer id
 * @return {*} Dispatch
 */
export const DeleteArticle = (post_id, author_id) => {
  return dispatch => {
    instance
      .post("articles/delete/" + post_id)
        .then(res => {
          dispatch({
            type: DELETE_ARTICLE,
          });
          instance
            .get("articles/readall/" + author_id)
              .then(res => {
                // console.log(res.data.data);
                dispatch({
                  type: GET_ALL_ARTICLES,
                  payload: res.data.data
                });
              })
              .catch(error => {
                dispatch({
                  type: GET_DATA_ERROR,
                  error: error.data
                });
              });
        })
        .catch(error => {
          dispatch({
            type: GET_DATA_ERROR,
            error: error.data
          });
        });
    }
}

/**
 * This method is used to update an article
 * @param  {ObjectId} post_id article id
 * @param  {ObjectId} author_id producer id
 * @param  {String} content content of the article created
 * @return {*} Dispatch
 */
export const UpdateArticle = (post_id, author_id, content) => {
  return dispatch => {
    instance
      .post("articles/update/" + post_id,
      {
                content: content
      })
        .then(res => {
          dispatch({
            type: CREATE_ARTICLE,
            payload: res.data
          });
          instance
            .get("articles/readall/" + author_id)
              .then(res => {
                // console.log(res.data.data);
                dispatch({
                  type: GET_ALL_ARTICLES,
                  payload: res.data.data
                });
              })
              .catch(error => {
                dispatch({
                  type: GET_DATA_ERROR,
                  error: error.data
                });
              });
        })
        .catch(error => {
          console.log(" REQUEST error2.response: ",error.response.data.message)
          dispatch({
            type: CREATE_ARTICLE_ERROR,
            error: error.response.data.message,
            payload:"",
          });
        });
    }
}

//=======================================================================================================================================

/**
 * This method is used to Subscribe to a producer ( for consumers )
 * @param  {String} my_producers the producer ID 
 * @return {*} Dispatch
 */
export const SubscribeProducers = (my_producers) => {
  return dispatch => {
    instance
      .post("consumers/addAfavoriteProducer/" + my_producers)
        .then(res => {
          dispatch({
            type: SUBSCRIBE_TO_PRODUCER,
            payload: res.data.message
          });
        })
        .catch(error => {
          dispatch({
            type: GET_DATA_ERROR,
            error: error.message
          });
        });
    }
}

/**
 * This method is used to add a product to a favorite list ( for consumers )
 * @param  {String} my_categories the product ID 
 * @return {*} Dispatch
 */
export const SubscribeProducts = (my_categories) => {
  return dispatch => {
    instance
      .post("consumers/addAfavoriteProduct/" + my_categories)
        .then(res => {
          dispatch({
            type: SUBSCRIBE_TO_PRODUCT,
            payload: res.data.message
          });
        })
        .catch(error => {
          dispatch({
            type: GET_DATA_ERROR,
            error: error.message
          });
        });
    }
}

/**
 * This method is used to get all followers infos for the producer profile
 * @return {*} Dispatch
 */
export const GetConsumersInfos = () => {
  return dispatch => {
    instance
      .get("/getconsumersinfos")
        .then(res => {
          dispatch({
            type: GET_FOLLOWERS,
            payload: res.data
          });
        })
        .catch(error => {
          dispatch({
            type: GET_DATA_ERROR,
            error: error.data
          });
        });
    }
}

/**
 * Immediately disable redirection when a redirection is fired
 * @return {*} dispatch
 */
export const disableRedirection = () => {
  return dispatch => {
    dispatch({
      type: DISABLE_REDIRECTION
    });
  }
}

/**
 * Search for all products categories in DB
 * @return {*} dispatch
 */
export const GetCategories = () => {
  return dispatch => {
    instance
      .get("categories/read")
        .then(res => {
          dispatch({
            type: GET_CATEGORIES_SUCCESS,
            payload: res.data
          });
        })
        .catch(error => {
          dispatch({
            type: GET_CATEGORIES_ERROR,
            error: "Internal Server Error. Please Contact your administrator"
          });
        });
    }
}

/**
 * Get all producers making products in relation with the asked category
 * @param {string} category
 * @return dispatch
 */
export const GetProducerFromCategory = (category) => {
  console.log(" Requete -> Chercher producteurs depuis categorie de produit :", category);
  return dispatch => {
    instance
      .post("search/producers", { category })
        .then(res => {
          // console.log(res);
          dispatch({
            type: GET_PRODUCERS_SUCCESS,
            payload: res.data
          });
        })
        .catch(error => {
          dispatch({
            type: GET_PRODUCERS_ERROR,
            error: "Internal Server Error. Please Contact your administrator"
          });
        });
    }
}

/**
 * Get all producers making products in relation with the asked product
 * @param {string} product
 * @return dispatch
 */
export const GetProducerFromProduct = (product) => {
  console.log(" requete -> Chercher producteurs depuis produit :", product);
  return dispatch => {
    instance
      .post("search/producers", { product })
        .then(res => {
          // console.log(res.data);
          dispatch({
            type: GET_PRODUCERS_SUCCESS,
            payload: res.data
          });
        })
        .catch(error => {
          dispatch({
            type: GET_PRODUCERS_ERROR,
            error: "Internal Server Error. Please Contact your administrator"
          });
        });
    }
}

/**
 * Reset error property in Redux Store
 * @return dispatch
 */
export const ResetError = () => {
  return dispatch => {
    dispatch({
      type: RESET_ERROR
    });
  }
}

/**
 * Set activeProducer property in Redux Store 
 * @deprecated - not used any more
 * @param {ObjectId} id - producer id
 * @return dispatch
 */
export const SetActiveProducer = (id) => {
  return dispatch => {
    dispatch({
      type: SET_ACTIVE_PRODUCER,
      payload: id
    })
  }
}

/**
 * Reset activeProducer property in Redux Store 
 * @deprecated - not used any more
 * @param {ObjectId} id - producer id
 * @return dispatch
 */
export const ResetActiveProducer = () => {
  return dispatch => {
    dispatch({
      type: RESET_ACTIVE_PRODUCER
    })
  }
}

/**
 * Search for cities corresponding to zip code
 * @param {string} zipCode - zip code
 * @return dispatch
 */
export const SearchForCoordinates = (zipCode) => {
  return dispatch => {
    axios
      .get(API_GEO_BASE_URL + '/communes?codePostal=' + zipCode + '&fields=centre&format=json&geometry=centre')
        .then(res => {
          // console.log(res.data);
          dispatch({
            type: GET_API_GEO_SUCCESS,
            payload: res.data
          });
        })
        .catch(error => {
          dispatch({
            type: GET_API_GEO_ERROR,
            error: "Internal Server Error. Please Contact your administrator"
          });
        });
    }
}

/**
 * Search for cities corresponding to zip code
 * @deprecated - Not used anymore
 * @param {string} cityCode - city code (see : https://api.gouv.fr/documentation/api-geo)
 * @return dispatch
 */
export const GetCityFromList = (cityCode) => {
  return dispatch => {
    axios
      .get(API_GEO_BASE_URL + '/communes?codePostal=' + cityCode + '&fields=centre&format=json&geometry=centre')
        .then(res => {
          // console.log(res.data);
          dispatch({
            type: GET_CITY_SUCCESS,
            payload: res.data
          });
        })
        .catch(error => {
          dispatch({
            type: GET_CITY_ERROR,
            error: "Internal Server Error. Please Contact your administrator"
          });
        });
    }
}

/**
 * Updates city informations in Redux Store 
 * @param {array} coordinates - Array of city lat & lng
 * @return dispatch
 */
export const updateCityCoordinates = (coordinates) => {
  return dispatch => {
    dispatch({
      type: UPDATE_CITY_COORDINATES,
      payload: coordinates
    })
  }
}

/**
 * Updates circle radius in Redux Store
 * @param {string} distance - map circle radius around initial position
 * @return dispatch
 */
export const updateCircleRadius = (distance) => {
  return dispatch => {
    dispatch({
      type: UPDATE_CIRCLE_RADIUS,
      payload: distance
    })
  }
}


//=======================================================================================================================================
//                                              P R O D U C E R S     R E Q U E S T S
//=======================================================================================================================================


/**
 * This method is used to get producer informations when he/she is logged in and take no parameter
 * @return {*} Dispatch
 */
export const GetProducerData = () => {
    return dispatch => {
        instance
            .get("producers/myProfile")
            .then(res => {
                console.log("Producer datas successfully picked up");
                dispatch({
                    type: GET_DATA_PRODUCER,
                    payload: res.data.producerProfile
                });
                instance
                    .get("pickup/readall/"+ res.data.producerProfile.login )
                    .then(res => {
                        console.log("Pick-up datas successfully picked up", res.data.data[0]);
                        dispatch({
                            type: GET_DATA_PICKUP,
                            payload: res.data.data[0]
                        });
                    })
                    .catch(error => {
                        console.log("Sorry something went wrong with your request", error);
                        dispatch({
                            type: GET_DATA_ERROR,
                            payload: ''
                        });
                    });
            })
            .catch(error => {
                console.log("Sorry something went wrong with your request", error);
                dispatch({
                    type: GET_DATA_ERROR,
                    payload: ''
                });
            });
    }
}


/**
 * This method is used to get all producers information and takes no parameter
 * @return {*} Dispatch
 */
export const GetAllProducersData = () => {
  // console.log( " ----- getAllProducersData ---- new route ------")
    return dispatch => {
        instance
            .get("general/AllProducers")
            .then(res => {
                // console.log(" * ---- Get All Producers sorted by DESC: ", res.data.producers);
                dispatch({
                    type: GET_DATA_ALL_PRODUCERS,
                    payload: res.data.producers
                });
            })
            .catch(error => {
                console.log("Error get all producers data request +++", error);
                dispatch({
                    type: GET_DATA_ERROR,
                    payload: ''
                });
            });
    }
}


/**
 * This method is used to get producer information using its id
 * @param  {ObjectId} id Producer id
 * @return {*} Dispatch
 */
export const GetProducerDataById = (id) => {
    return dispatch => {
        instance
            .get("/admin/producers/"+ id)
            .then(res => {
                // console.log(" * Get producer by id ", res.data.producer, "----[request.js]");
                dispatch({
                    type: GET_DATA_PRODUCER_BY_ID,
                    payload: res.data.producer
                });
            })
            .catch(error => {
                console.log("Error from request get producer data by id ", error);
                dispatch({
                    type: GET_DATA_ERROR,
                    payload: ''
                });
            });
    }
}

/**
 * This method is used to update producer information
 * @param  {String} farmName Name of his Farm
 * @param  {String} producerPresentation Text to present the producer
 * @param  {String} farmPresentation text to present his farm
 * @param  {String} productsPresentation text to present his products
 * @return {*} Dispatch
 */
export const UpdateProducerData = (farmName,producerPresentation,farmPresentation,productsPresentation) => {
    return dispatch => {
        instance
            .put("producers/myProfile",
                {
                    farmName: farmName,
                    producerPresentation: producerPresentation,
                    farmPresentation: farmPresentation,
                    productsPresentation: productsPresentation,
                })
            .then(res => {
                dispatch({
                    type: UPDATE_PRODUCER_PROFILE,
                });
                instance
                    .get("producers/myProfile")
                    .then(res => {
                        console.log("Producer datas successfully picked up", res.data.producerProfile);
                        dispatch({
                            type: GET_DATA_PRODUCER,
                            payload: res.data.producerProfile
                        });
                    })
                    .catch(error => {
                        console.log("Sorry something went wrong with your request", error);
                        dispatch({
                            type: GET_DATA_ERROR,
                            payload: ''
                        });
                    });
            })
            .catch(error => {
                dispatch({
                    type: GET_DATA_ERROR,
                    error: error.data
                });
            });
    }
}

/**
 * This method is used to update producer Farm Address and contacts
 * @param  {String} address Farm address
 * @param  {String} city farm city
 * @param  {String} zipCode farm zip_code
 * @param  {Number} phone farm phone number
 * @return {*} Dispatch
 */
export const UpdateProducerContact = (address, city, zipCode, phone) => {
    return dispatch => {
        instance
            .put("producers/myProfile",
                {
                    address: address,
                    city: city,
                    zipCode: zipCode,
                    phone: phone,
                })
            .then(res => {
                dispatch({
                    type: UPDATE_PRODUCER_CONTACT,
                });
                instance
                    .get("producers/myProfile")
                    .then(res => {
                        console.log("Producer datas successfully picked up", res.data.producerProfile);
                        dispatch({
                            type: GET_DATA_PRODUCER,
                            payload: res.data.producerProfile
                        });
                    })
                    .catch(error => {
                        console.log("Sorry something went wrong with your request", error);
                        dispatch({
                            type: GET_DATA_ERROR,
                            payload: ''
                        });
                    });
            })
            .catch(error => {
                dispatch({
                    type: GET_DATA_ERROR,
                    error: error.data
                });
            });
    }
}

/**
 * This method is used to update the "you need to know" card on the producer page.
 * @param  {String} producer_toKnow what you need to know about the producer.
 * @return {*} Dispatch
 */
export const UpdateProducerToKnow = (producer_toKnow) => {
    return dispatch => {
        instance
            .put("producers/myProfile",
                {
                    toKnow: producer_toKnow,
                })
            .then(res => {
                dispatch({
                    type: UPDATE_TO_KNOW_PRODUCER,
                });
                instance
                    .get("producers/myProfile")
                    .then(res => {
                        console.log("Producer datas successfully picked up", res.data.producerProfile);
                        dispatch({
                            type: GET_DATA_PRODUCER,
                            payload: res.data.producerProfile
                        });
                    })
                    .catch(error => {
                        console.log("Sorry something went wrong with your request", error);
                        dispatch({
                            type: GET_DATA_ERROR,
                            payload: ''
                        });
                    });
            })
            .catch(error => {
                dispatch({
                    type: GET_DATA_ERROR,
                    error: error.data
                });
            });
    }
}


//=======================================================================================================================================
//                                                  P R O D U C T   R E Q U E S T S
//=======================================================================================================================================

/**
 * This method is used to get all products created by one producer
 * @param  {String} login producer login
 * @return {*} Dispatch
 */
export const GetProductsByProducer = (login) => {
    return dispatch => {
        instance
            .get("/products/readall/name/"+ login)
            .then(res => {
                // console.log("Get products by producer ", res.data);
                dispatch({
                    type: GET_PRODUCTS_BY_PRODUCER,
                    payload: res.data
                });
            })
            .catch(error => {
                console.log("Error from request get products by producer", error);
                dispatch({
                    type: GET_DATA_ERROR,
                    payload: ''
                });
            });
    }
}

/**
 * This method is used to get all products created by one producer using his _id
 * @param  {ObjectId} id producer _id
 * @return {*} Dispatch
 */
export const GetProductsByProducerId = (id) => {
    return dispatch => {
        instance
            .get("/products/readall/id/"+ id)
            .then(res => {
                // console.log("Get products by producerId ", res.data);
                dispatch({
                    type: GET_PRODUCTS_BY_PRODUCER_ID,
                    payload: res.data
                });
            })
            .catch(error => {
                console.log("Error from request  GetProductsByProducerId", error);
                dispatch({
                    type: GET_DATA_ERROR,
                    payload: ''
                });
            });
    }
}

/**
 * This method is used to delete one product from producer products list
 * @param  {ObjectId} product_id product id
 * @param  {ObjectId} author_id id of the producer who created the product
 * @return {*} Dispatch
 */
export const DeleteProductFromProducerList = (product_id, author_id) => {
    return dispatch => {
        instance
            .post("products/delete/" + product_id)
            .then(res => {
                dispatch({
                    type: DELETE_PRODUCT,
                });
                instance
                    .get("products/readall/name/" + author_id)
                    .then(res => {
                        // console.log(res.data);
                        dispatch({
                            type: GET_PRODUCTS_BY_PRODUCER,
                            payload: res.data
                        });
                    })
                    .catch(error => {
                        dispatch({
                            type: GET_DATA_ERROR,
                            error: error.data
                        });
                    });
            })
            .catch(error => {
                dispatch({
                    type: GET_DATA_ERROR,
                    error: error.data
                });
            });
    }
}

/**
 * This method is used on the producer side to update a product sold by one producer
 * @param  {ObjectId} product_id product id in BDD
 * @param  {ObjectId} author_id producer id who created the PickUpPoint
 * @param  {String} name_product product name
 * @param  {String} category_product product category
 * @param  {String} conditioning_product how the product is conditioned
 * @param  {String} stock_product is the product in stock or not
 * @param  {Number} price_product how much the product is sold
 * @return {*} Dispatch
 */
export const UpdateProductFromProducerList = (product_id, author_id, name_product,category_product,conditioning_product,stock_product,price_product) => {
    return dispatch => {
        instance
            .post("products/update/" + product_id,
                {
                    name: name_product,
                    category: category_product,
                    conditioning: conditioning_product,
                    stock: stock_product,
                    price: price_product

                })
            .then(res => {
                dispatch({
                    type: UPDATE_PRODUCT,
                });
                instance
                    .get("products/readall/name/" + author_id)
                    .then(res => {
                        dispatch({
                            type: GET_PRODUCTS_BY_PRODUCER,
                            payload: res.data
                        });
                    })
                    .catch(error => {
                        dispatch({
                            type: GET_DATA_ERROR,
                            error: error.data
                        });
                    });
            })
            .catch(error => {
                dispatch({
                    type: GET_DATA_ERROR,
                    error: error.data
                });
            });
    }
}

/**
 * This method is used on the producer side to create a product sold by producer
 * @param  {String} author producer login who created the PickUpPoint
 * @param  {ObjectId} author_id producer id who created the PickUpPoint
 * @param  {String} name_product product name
 * @param  {String} category_product product category
 * @param  {String} conditioning_product how the product is conditioned
 * @param  {String} stock_product is the product in stock or not
 * @param  {Number} price_product how much the product is sold
 * @return {*} Dispatch
 */
export const CreateProductFromProducerList = ( author, author_id, name_product,category_product,conditioning_product,stock_product,price_product) => {
    return dispatch => {
        instance
            .post("products/create/",
                {
                    author: author,
                    author_id: author_id,
                    name: name_product,
                    category: category_product,
                    conditioning: conditioning_product,
                    stock: stock_product,
                    price: price_product

                })
            .then(res => {
                dispatch({
                    type: CREATE_PRODUCT,
                });
                instance
                    .get("products/readall/name/" + author)
                    .then(res => {
                        dispatch({
                            type: GET_PRODUCTS_BY_PRODUCER,
                            payload: res.data
                        });
                    })
                    .catch(error => {
                        dispatch({
                            type: GET_DATA_ERROR,
                            error: error.data
                        });
                    });
            })
            .catch(error => {
                dispatch({
                    type: GET_DATA_ERROR,
                    error: error.data
                });
            });
    }
}

//=======================================================================================================================================
//                                      P I C K _ U P      P O I N T    R E Q U E S T S
//=======================================================================================================================================

/**
 * This method is used to get the address of a PickUp Point enter by one producer
 * @param  {String} author producer login who created the PickUpPoint
 * @return {*} Dispatch
 */
export const GetPickUpPoint =(author)=>{
    return dispatch => {
        instance
        .get("pickup/readall/" + author)
        .then(res => {
            dispatch({
                type: GET_DATA_PICKUP,
                payload: res.data.data[0]
            });
        })
        .catch(error => {
            dispatch({
                type: GET_DATA_ERROR,
                error: error.data
            });
        });
}
}

/**
 * This method is used on the producer side to create a PickUpPoint
 * @param  {String} author producer login who created the PickUpPoint
 * @param  {String} pick_up_name PickUpPoint name
 * @param  {String} address PickUpPoint address
 * @param  {String} zip_code PickUpPoint zip_code
 * @param  {String} city PickUpPoint city
 * @param  {Number} phone PickUpPoint phone number
 * @param  {String} opening_hours PickUpPoint opening hours
 * @param  {String} payment_methods payment methods allowed on PickUpPoint
 * @return {*} Dispatch
 */
export const CreatePickUpPoint = ( author, pick_up_name,  address, zip_code, city, phone, opening_hours, payment_methods) => {
    return dispatch => {
        instance
            .post("pickup/create",
                {
                    pick_up_name: pick_up_name,
                    address: address,
                    zip_code: zip_code,
                    city: city,
                    phone: phone,
                    opening_hours: opening_hours,
                    producer_name: author,
                    payment_methods: payment_methods

                })
            .then(res => {
                dispatch({
                    type: CREATE_PICKUP,
                });
                instance
                    .get("pickup/readall/" + author)
                    .then(res => {
                        dispatch({
                            type: GET_DATA_PICKUP,
                            payload: res.data.data[0]
                        });
                    })
                    .catch(error => {
                        dispatch({
                            type: GET_DATA_ERROR,
                            error: error.data
                        });
                    });
            })
            .catch(error => {
                dispatch({
                    type: GET_DATA_ERROR,
                    error: error.data
                });
            });
    }
}

/**
 * This method is used on the producer side to update his PickUpPoint
 * @param  {String} author producer login who created the PickUpPoint
 * @param  {String} pick_up_name PickUpPoint name
 * @param  {String} address PickUpPoint address
 * @param  {String} zip_code PickUpPoint zip_code
 * @param  {String} city PickUpPoint city
 * @param  {Number} phone PickUpPoint phone number
 * @param  {String} opening_hours PickUpPoint opening hours
 * @param  {String} payment_methods payment methods allowed on PickUpPoint
 * @return {*} Dispatch
 */
export const UpdatePickUpPoint = (id, author, pick_up_name,  address, zip_code, city, phone, opening_hours, payment_method) => {
    return dispatch => {
        instance
            .post("pickup/update/"+id,
                {
                    pick_up_name: pick_up_name,
                    address: address,
                    zip_code: zip_code,
                    city: city,
                    phone: phone,
                    opening_hours: opening_hours,
                    producer_name: author,
                    payment_methods: payment_method

                })
            .then(res => {
                dispatch({
                    type: UPDATE_PICKUP,
                });
                instance
                    .get("pickup/readall/" + author)
                    .then(res => {
                        dispatch({
                            type: GET_DATA_PICKUP,
                            payload: res.data.data[0]
                        });
                    })
                    .catch(error => {
                        dispatch({
                            type: GET_DATA_ERROR,
                            error: error.data
                        });
                    });
            })
            .catch(error => {
                dispatch({
                    type: GET_DATA_ERROR,
                    error: error.data
                });
            });
    }
}

/**
 * This method is used to delete an existing pickUpPoint when key is being pressed
 * @param  {ObjectId} id PickUpPoint _id
 * @param  {String} author producer login who created the PickUpPoint
 * @return {*} Dispatch
 */
export const DeletePickUpPoint = (id, author) => {
    return dispatch => {
        instance
            .post("pickup/delete/" + id)
            .then(res => {
                dispatch({
                    type: DELETE_PICKUP,
                });
                instance
                    .get("pickup/readall/" + author)
                    .then(res => {
                        dispatch({
                            type: GET_DATA_PICKUP,
                            payload: res.data.data[0]
                        });
                    })
                    .catch(error => {
                        dispatch({
                            type: GET_DATA_ERROR,
                            error: error.data
                        });
                    });
            })
            .catch(error => {
                dispatch({
                    type: GET_DATA_ERROR,
                    error: error.data
                });
            });
    }
}


//=======================================================================================================================================
//                                                A D M I N     R E Q U E S T S
//=======================================================================================================================================

/**
 * This method is used on the admin side to remove a producer from the producer list
 * @param  {ObjectId} producer_id producer id in BDD
 * @return {*} Dispatch
 */
export const DeleteProducerFromAdminList = (producer_id) => {
    return dispatch => {
        instance
            .delete("/admin/producers/" + producer_id)
            .then(res => {
                dispatch({
                    type: DELETE_PRODUCER_BY_ID,
                });
                instance
                    .get("/newProducers")
                    .then(res => {
                        // console.log("Get All Producers sorted by DESC: ", res.data.producers);
                        dispatch({
                            type: GET_DATA_ALL_PRODUCERS,
                            payload: res.data.producers
                        });
                    })
                    .catch(error => {
                        console.log("Error from request ", error);
                        dispatch({
                            type: GET_DATA_ERROR,
                            payload: ''
                        });
                    });
            })
            .catch(error => {
                dispatch({
                    type: GET_DATA_ERROR,
                    error: error.data
                });
            });
    }
}

/**
 * This method is used on the admin side to Update in real Time GPS Coordinates of a producer farm
 * @param  {ObjectId} producer_id producer id in BDD
 * @param  {Array} gps_Coordinates GPS Coordinates in BDD
 * @return {*} Dispatch
 */
export const UpdateGPSProducer = (producer_id, gps_Coordinates) => {
    return dispatch => {
        instance
            .put("producers/" + producer_id,
                {
                    gpsCoordinates: gps_Coordinates,
                })
            .then(res => {
                dispatch({
                    type: UPDATE_GPS_PRODUCER,
                });
                instance
                    .get("/newProducers")
                    .then(res => {
                        // console.log("Get All Producers sorted by DESC: ", res.data.producers);
                        dispatch({
                            type: GET_DATA_ALL_PRODUCERS,
                            payload: res.data.producers
                        });
                    })
                    .catch(error => {
                        console.log("Error from request", error);
                        dispatch({
                            type: GET_DATA_ERROR,
                            payload: ''
                        });
                    });
            })
            .catch(error => {
                dispatch({
                    type: GET_DATA_ERROR,
                    error: error.data
                });
            });
    }
}

/**
 * This method is used on the admin side to Update producer Status (accepted, waiting or refused from website)
 * @param  {ObjectId} producer_id producer id in BDD
 * @param  {String} producer_status Producer status is either: accepted, waiting or refused
 * @return {*} Dispatch
 */
export const UpdateStatusProducer = (producer_id, producer_status ) => {
    return dispatch => {
        instance
            .put("producers/" + producer_id,
                {
                    status:  producer_status,
                })
            .then(res => {
                dispatch({
                    type: UPDATE_STATUS_PRODUCER,
                });
                instance
                    .get("/newProducers")
                    .then(res => {
                        // console.log("Get All Producers sorted by DESC: ", res.data.producers);
                        dispatch({
                            type: GET_DATA_ALL_PRODUCERS,
                            payload: res.data.producers
                        });
                    })
                    .catch(error => {
                        console.log("Error from request +++", error);
                        dispatch({
                            type: GET_DATA_ERROR,
                            payload: ''
                        });
                    });
            })
            .catch(error => {
                dispatch({
                    type: GET_DATA_ERROR,
                    error: error.data
                });
            });
    }
}


//=======================================================================================================================================
//                                      C O N S U M E R S     R E Q U E S T S
//=======================================================================================================================================



// ============================================= update my profile as consumer =============================================

/**
 * This method is used to update his/her own profile as consumer, profile is immediatly updated
 * @param  {String} login new consumer login
 * @param  {String} email new consumer email
 * @param  {int} zip_code new consumer zip code
 * @param  {string} password new consumer password
 * @param  {string} password_confirmation confirm the new consumer password

 * @return {*} Dispatch success or error data
 */
export const UpdateConsumer = (login, email, zip_code, password, password_confirmation, ) => {
  return dispatch => {
    instance
      .post("consumers/myprofile/update",
          {
            login: login,
            email: email,
            zip_code: zip_code,
            password: password,
            password_confirmation : password_confirmation,
          }
        )
        .then(res => {
          dispatch({
            type: GET_UPDATE_CONSUMER_SUCCESS,
            payload: res.data.message
          });
        })
        .catch(error => {
          let errorMessage = "";
          if (error.response) {
            errorMessage = error.response.data.message;
            console.log(" * response from server -> ", error.response);
          } else {
            errorMessage = "Un problème est survenu...";
          }
          dispatch({
            type: GET_UPDATE_CONSUMER_ERROR,
            payload: '',
            error: errorMessage
          });
        });
    }
}

// ============================================= DELETE my profile as consumer =============================================

/**
 * This method is used to remove his/her own profile as consumer in the data base.
 * @param  {ObjectId} consumer_id consumer's id in BDD
 * @return {*} Dispatch success or error data
 */
export const DeleteConsumer = (consumer_id) => {
  // console.log(" * delete my profile...")
  return dispatch => {
    instance
      .delete("consumers/myprofile/delete")
        .then(res => {
          // console.log(res.data);
          dispatch({
            type: GET_DATA_SUCCESS,
            payload: res.data
          });
        })
        .catch(error => {
          let errorMessage = "";
          if (error.response) {
            errorMessage = error.response.data.message;
            console.log(" * response from server -> ", error.response);
          } else {
            errorMessage = "Un problème est survenu...";
          }
          dispatch({
            type: GET_DATA_ERROR,
            payload: '',
            error: errorMessage
          });
        });
    }
}


// ============================================= GET MY * FAVORITES * PRODUCERS  =============================================
/**
 * This method is used to get my favorites producers as consumer
 * @return {*} Dispatch data about all producers are in my favorites if success or error data
 */
export const GetfavoritesProducers = () => {
  return dispatch => {
    instance
      .get("consumers/myFavoritesProducers")
      .then(res => {
        dispatch({
          type: GET_FAVORITES_PRODUCERS,
          payload: res.data,
        });
      })
      .catch(error => {
        let errorMessage = "";
        if (error.response) {
          errorMessage = error.response.data.message;
          console.log(" * error.response from server -> ", error.response);
        } else {
          errorMessage = "Un problème est survenu...";
        }
        dispatch({
          type: GET_DATA_ERROR,
          payload: '',
          error: errorMessage
        });
      });
  }
}

// ============================================= REMOVE A PRODUCER FROM MY * FAVORITES * LIST =============================================

/**
 * This method is used to remove one producer from the list of my favorites ones.
 * @param  {ObjectId} producer_id producer's id to removed in BDD
 * @return {*} Dispatch success or error data
 */
export const RemoveAFavoriteProducer = (producer_id) => {
  return dispatch => {
    instance
      .post("consumers/RemoveAfavoriteProducer/"+producer_id)
      .then(res => {
        dispatch({
          type: GET_MESSAGE_FROM_SERVER,
          payload: res.data,
        });
      })
      .catch(error => {
        let errorMessage = "";
        if (error.response) {
          errorMessage = error.response.data.message;
          console.log(" * error.response from server -> ", error.response);
        } else {
          errorMessage = "Un problème est survenu...";
        }
        dispatch({
          type: GET_DATA_ERROR,
          payload: '',
          error: errorMessage
        });
      });
  }
}

// ============================================= GET my favorites products =============================================

/**
 * This method is used to get all the products which are the list of my favorites
 * @return {*} Dispatch data about this products if success or error data
 */
export const GetfavoritesProducts = () => {
  return dispatch => {
    instance
      .get("consumers/myFavoritesProducts")
      .then(res => {
        // console.log(" * res data: ",res.data);
        dispatch({
          type: GET_FAVORITES_PRODUCTS,
          payload: res.data,
        });
      })
      .catch(error => {
        let errorMessage = "";
        if (error.response) {
          errorMessage = error.response.data.message;
          console.log(" * error.response from server -> ", error.response);
        } else {
          errorMessage = "Un problème est survenu...";
        }
        dispatch({
          type: GET_DATA_ERROR,
          payload: '',
          error: errorMessage
        });
      });
  }
}

// ============================================= REMOVE A PRODUCT FROM MY * FAVORITES * LIST =============================================
/**
 * This method is used to remove one product which are the list of my favorites
 * @param  {ObjectId} product_id product's id to removed from the list in BDD
 * @return {*} Dispatch success or error data
 */
export const RemoveAFavoriteProduct = (product_id) => {
  return dispatch => {
    instance
      .post("consumers/RemoveAfavoriteProduct/"+product_id)
      .then(res => {
        dispatch({
          type: GET_MESSAGE_FROM_SERVER,
          payload: res.data,
        });
      })
      .catch(error => {
        let errorMessage = "";
        if (error.response) {
          errorMessage = error.response.data.message;
          console.log(" * error.response from server -> ", error.response);
        } else {
          errorMessage = "Un problème est survenu...";
        }
        dispatch({
          type: GET_DATA_ERROR,
          payload: '',
          error: errorMessage
        });
      });
  }
}


//=======================================================================================================================================
//                                      P I C T U R E S      R E Q U E S T S
//=======================================================================================================================================

/**
 * Uploads picture
 * @param {string} url - route url in backend
 * @param {ObjectId} id - document where to update picture
 * @param {string} imagePath - image path
 * @param {string} login - producer login
 * @return dispatch
 */
export const UploadPicture = (url, id, imagePath, login) => {
  // console.log("que vaut login ???", login);
  switch(url) {
    case 'producer-presentation':
      url = 'upload/producer-presentation'
    break;
    case 'farm-presentation':
      url = 'upload/farm-presentation'
    break;
    case 'products-presentation':
      url = 'upload/products-presentation'
    break;
    case 'product':
      url = 'upload/product'
    break;
    case 'article':
      url = 'upload/article'
    break;
    default:
      return dispatch => ({
        type: PICTURE_PRODUCER_UPLOAD_ERROR,
        error: "Internal Server Error. Please Contact your administrator"
      });
  }
  let fd = new FormData();
  fd.append('fileToUpload',imagePath, imagePath.name);
  fd.append('id',id);

  return dispatch => {
      instance
        .post(url, fd)
          .then(res => {
            if (!login) {
              instance
                .get("producers/myProfile")
                .then(res => {
                    dispatch({
                        type: GET_DATA_PRODUCER,
                        payload: res.data.producerProfile
                    });
                })
                .catch(error => {
                    console.log("Sorry something went wrong with your request", error);
                    dispatch({
                        type: GET_DATA_ERROR,
                        payload: ''
                    });
                });
            }
            else {
              // Once image is uploaded, get all updated products from producer
              instance
                .get("/products/readall/name/"+ login)
                .then(res => {
                    dispatch({
                        type: GET_PRODUCTS_BY_PRODUCER,
                        payload: res.data
                    });
                })
                .catch(error => {
                    console.log("Error from request ", error);
                    dispatch({
                        type: GET_DATA_ERROR,
                        payload: ''
                    });
                });

              // Once image is uploaded, get all updated articles from producer
              instance
                .get("articles/readall")
                  .then(res => {
                    dispatch({
                      type: GET_ALL_ARTICLES,
                      payload: res.data.data
                    });
                  })
                  .catch(error => {
                    dispatch({
                      type: GET_DATA_ERROR,
                      error: error.data
                    });
                  });
            }
          })
          .catch(error => {
            dispatch({
              type: PICTURE_PRODUCER_UPLOAD_ERROR,
              error: "Internal Server Error. Please Contact your administrator"
            });
          });
    }
}


//=======================================================================================================================================
//                                                      G R A D E S
//=======================================================================================================================================

/**
 * This method is used to get the average rating of a producer.
 * @param  {ObjectId} producer_id producer's id in BDD
 * @return {*} Dispatch the note if success or error data
 */
export const GetGrade = (producer_id) => {
  return dispatch => {
    instance
      .get("averageGrades/"+producer_id)
      .then(res => {
        // console.log(" * res data grade: ",res.data);
        dispatch({
          type: GET_GRADE,
          payload: res.data,
        });
      })
      .catch(error => {
        let errorMessage = "";
        if (error.response) {
          errorMessage = error.response.data.message;
          console.log(" * error.response from server -> ", error.response);
        } else {
          errorMessage = "Un problème est survenu...";
        }
        dispatch({
          type: GET_DATA_ERROR,
          payload: '',
          error: errorMessage
        });
      });
  }
}

/**
 * this method is used to send a consumer's rating to the list of ratings already assigned in a producer's profile, 
 * then update the average rate of the producer
 * @param  {ObjectId} producer_id producer's id in BDD
 * @param {float} grade the value of the new grade
 * @param {ObjectId} gradesConsId the id of the voting consumer
 * @return {*} Dispatch the new average note if success or error data
 */
export const SendMyVote = (value, producer_id, consumer_id)=> {
  return dispatch => {
    instance
      .post("addAGrade/"+producer_id,
        {
          grade : value,
          gradesConsId : consumer_id
        }
      )
      .then(res => {
        dispatch({
          type: GET_NEW_GRADE_SUCCESS,
          payload: res.data,
        });
          instance
            .get("averageGrades/"+producer_id)
            .then(res => {
              dispatch({
                type: GET_GRADE,
                payload: res.data,
              });
            })
            .catch(error => {
              let errorMessage = "";
              if (error.response) {
                errorMessage = error.response.data.message;
              } else {
                errorMessage = "Un problème est survenu...";
              }
              dispatch({
                type: GET_DATA_ERROR,
                payload: '',
                error: errorMessage
              });
            });
      })
      .catch(error => {
        let errorMessage = "";
        if (error.response) {
          errorMessage = error.response.data;
        } else {
          errorMessage = "Un problème est survenu...";
        }
        dispatch({
          type: GET_VOTE_ERROR,
          payload: '',
          error: errorMessage
        });
      });
  }

}



//=======================================================================================================================================
//                                                      H O W    M A N Y    ...
//========================================================================================================================================
/**
 * This method is used to get the number of producers registered in the database
 * @return {*} Dispatch the length if success or error data
 */
export const HowManyProducers = () => {
  return dispatch => {
    instance
      .get("/general/HowManyProducers")
      .then(res => {
        dispatch({
          type: NBR_PRODUCERS,
          payload: res.data,
        });
      })
      .catch(error => {
        let errorMessage = "";
        if (error.response) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = "Un problème est survenu...";
        }
        dispatch({
          type: GET_DATA_ERROR,
          payload: '',
          error: errorMessage
        });
      });
  }
}

/**
 * This method is used to get the number of consumers registered in the database
 * @return {*} Dispatch the length if success or error data
 */
export const HowManyConsumers = () => {
  return dispatch => {
    instance
      .get("/general/HowManyConsumers")
      .then(res => {
        dispatch({
          type: NBR_CONSUMERS,
          payload: res.data,
        });
      })
      .catch(error => {
        let errorMessage = "";
        if (error.response) {
          errorMessage = error.response.data.message;
          console.log(" * HowManyConsumers error.response from server -> ", error.response);
        } else {
          errorMessage = "Un problème est survenu...";
        }
        dispatch({
          type: GET_DATA_ERROR,
          payload: '',
          error: errorMessage
        });
      });
  }
}
