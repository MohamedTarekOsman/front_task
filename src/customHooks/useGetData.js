import baseUrl from "../Api/baseUrl";

const useGetData =async(url,params)=>{
    const res=await baseUrl.get(url,params)
    return res.data;
}

export {useGetData}