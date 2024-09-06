import { useGetData } from "../../customHooks/useGetData";
import { useInsertData } from "../../customHooks/useInsertData";
import { useUpdateData } from "../../customHooks/useUpdateDate";
import { CREATE_CAR, ERROR, GET_ALL_CARS, UPDATE_CAR } from "../types/Types";



export const createCar=(formData)=>async (dispatch)=>{
    try{
        const response=await useInsertData(`/cars`,formData);
        dispatch({
            type:CREATE_CAR,
            payload:response,
        })
    }catch(e){
        dispatch({
            type:ERROR,
            payload: "Error " + e,
        })
    }
}


export const getAllCars = (limit,page) => async (dispatch) => {
    try {
        const response = await useGetData(`/cars?limit=${limit}&page=${page}`);
        dispatch({
            type: GET_ALL_CARS,
            payload: response,
        })

    } catch (e) {
        dispatch({
            type: ERROR,
            payload: e.response,
        })
    }
}

export const updateCar=(formData)=>async (dispatch)=>{
    try{
        const response=await useUpdateData(`/cars`,formData);
        dispatch({
            type:UPDATE_CAR,
            payload:response,
        })
    }catch(e){
        dispatch({
            type:ERROR,
            payload: "Error " + e,
        })
    }
}