import { useEffect, useState } from "react";
import NavBarContainer from "./TasksNavBar/NavBarContainer";
import TasksTableComponent from "./TasksTable/TasksTableComponent";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import getAllTasksService from "../../../lib/services/TasksService/getAllTasksService";
import { prepareURLEncodedParams } from "../../../lib/requestUtils/urlEncoder";

const TasksPageComponent = () => {
    
    const router = useRouter();
    
    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);
    
    const [data, setData] = useState();
    const [paginationDetails, setPaginationDetails] = useState();



    const getAllTasks = async ({ page = 1, limit = 10, search_string = '', sortBy = '', sortType = '' }) => {
        
        let queryParams:any = {};
        if (page) {
            queryParams['page'] = page
        }
        if (limit) {
            queryParams['limit'] = limit
        }
        if (search_string) {
            queryParams['search_string'] = search_string
        }
        if (sortBy) {
            queryParams['sort_by'] = sortBy
        }
        if (sortType) {
            queryParams['sort_type'] = sortType
        }

        
        const paramString = prepareURLEncodedParams('', queryParams);

        const response = await getAllTasksService({page:1,limit:2,paramString:"",accessToken});
        if (response?.success) {
            console.log(response);
            const { data, ...rest } = response;
            setData(data);
            setPaginationDetails(rest);
        }
    }
    
    useEffect(() => {
        if (router.isReady && accessToken) {
            getAllTasks({page:1,limit:10});
        }
        
    }, [router.isReady, accessToken]);


    return (
        <div>
            <NavBarContainer />
            <TasksTableComponent data={data} getData={getAllTasks} paginationDetails={paginationDetails} />
        </div>
    )
}

export default TasksPageComponent;