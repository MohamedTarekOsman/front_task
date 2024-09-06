import baseUrl from "../Api/baseUrl";

export const useInsertData = async (url, params) => {

    const res = await baseUrl.post(url, params);
    return res.data;
    
}

