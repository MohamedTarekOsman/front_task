import axios from "axios";

//axios instance
const baseUrl= axios.create({baseURL:"http://localhost:5000"})

export default baseUrl