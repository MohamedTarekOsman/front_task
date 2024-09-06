import baseUrl from "../Api/baseUrl";


const useUpdateData=async(url,params)=>{
    const res = await baseUrl.put(url,params);
    return res.data;
}
export  {useUpdateData}