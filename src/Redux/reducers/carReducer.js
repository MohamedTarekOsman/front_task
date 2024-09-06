import { CREATE_CAR, GET_ALL_CARS, UPDATE_CAR } from "../types/Types";

const initialState = {
    cars: [],
    createdCar: [],
    updatedCar: [],
  };
  
  const carReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_ALL_CARS:
        return { 
                ...state,
                cars:action.payload 
        };

      case CREATE_CAR:
      return { 
              ...state,
              createdCar:action.payload 
      };

      case UPDATE_CAR:
      return { 
              ...state,
              updatedCar:action.payload 
      };

      default:
        return state;
    }
  };
  
  export default carReducer;
  