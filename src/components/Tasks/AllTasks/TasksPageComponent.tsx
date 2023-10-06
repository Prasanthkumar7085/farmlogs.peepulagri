import { useEffect, useState } from "react";
import NavBarContainer from "./TasksNavBar/NavBarContainer";
import TasksTableComponent from "./TasksTable/TasksTableComponent";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { prepareURLEncodedParams } from "../../../../lib/requestUtils/urlEncoder";
import getAllTasksService from "../../../../lib/services/TasksService/getAllTasksService";
import LoadingComponent from "@/components/Core/LoadingComponent";


interface ApiCallProps{
    page : string|number;
    limit : string|number;
    search_string:string;
    sortBy :string;
    sortType :string
}
const TasksPageComponent = () => {
    
    const router = useRouter();
    
    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);
    
    const [data, setData] = useState([]);
    const [paginationDetails, setPaginationDetails] = useState();
    const [loading, setLoading] = useState(true);



    const getAllTasks = async ({ page = 1, limit = 10, search_string = '', sortBy = '', sortType = '' }:Partial<ApiCallProps>) => {
        setLoading(true);
        let queryParams: any = {
            
        };
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
            queryParams['order_by'] = sortBy
        }
        if (sortType) {
            queryParams['order_type'] = sortType
        }

        const { page:pageCount, limit:limitCount, ...queryParamsUpdated } = queryParams;

        router.push({ query: queryParams });
        const paramString = prepareURLEncodedParams('', queryParamsUpdated);

        const response = await getAllTasksService({page:page,limit:limit,paramString:paramString,accessToken});
        if (response?.success) {
            const { data, ...rest } = response;
            setData(data);
            setPaginationDetails(rest);
        }
        setLoading(false);
    }
    
    // useEffect(() => {
    //     if (router.isReady && accessToken) {
    //         getAllTasks({page:1,limit:10});
    //     }
    // }, [router.isReady, accessToken]);

    const [searchString, setSearchString] = useState('');

    useEffect(() => {
        if (router.isReady && accessToken) {
            let delay = 500;
            let debounce = setTimeout(() => {
                getAllTasks({
                    page: router.query.page as string,
                    limit: router.query.limit as string,
                    search_string: searchString,
                    sortBy: router.query.order_by as string,
                    sortType: router.query.order_type as string,
                })

            }, delay);
            return () => clearTimeout(debounce);
        }
    }, [searchString, router.isReady, accessToken]);

    
    const onChangeSearch = (search:string) => {
        setSearchString(search);
        
    }

    return (
        <div>
            <NavBarContainer onChangeSearch={onChangeSearch} />
            {data.length ? <TasksTableComponent data={data} getData={getAllTasks} paginationDetails={paginationDetails} /> : (!loading?"No Data":"")}
            
            <LoadingComponent loading={loading}/>
        </div>
    )
}

export default TasksPageComponent;