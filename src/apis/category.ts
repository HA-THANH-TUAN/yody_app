import { AxiosResponse } from "axios";
import axiosInstance from "./axiosConfig"
import { ICategory, IResponse } from "../Models/response";

class CategoryApi{
    static getCategory(){
        return axiosInstance.get<any, IResponse<ICategory[]>>("/admin/categories");
    }
}

export default CategoryApi