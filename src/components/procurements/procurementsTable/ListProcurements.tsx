import LoadingComponent from "@/components/Core/LoadingComponent";
import { FarmInTaskType, userTaskType } from "@/types/tasksTypes";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { prepareURLEncodedParams } from "../../../../lib/requestUtils/urlEncoder";
import ImageComponent from "@/components/Core/ImageComponent";
import getAllProcurementService from "../../../../lib/services/ProcurementServices/getAllProcrumentService";
import ProcurementsTableComponent from "./ProcurementsTableComponent";
import { addSerial } from "@/pipes/addSerial";
import ProcurementNavBarContainer from "@/components/Tasks/AllTasks/TasksNavBar/NavBarContainerProcurement";

export interface ApiCallProps {
    page: string | number;
    limit: string | number;
    search_string: string;
    sortBy: string;
    sortType: string;
    selectedFarmId: string;
    status: string;
    userId: string;
}
const ListProcurments = () => {
    const router = useRouter();
    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );
    const [data, setData] = useState([]);
    const [paginationDetails, setPaginationDetails] = useState();
    const [loading, setLoading] = useState(true);
    const [searchString, setSearchString] = useState("");
    const [selectedFarm, setSelectedFarm] = useState<FarmInTaskType | null>();

    const getAllProcurements = async ({
        page = 1,
        limit = 15,
        search_string = "",
        sortBy = "",
        sortType = "",
        selectedFarmId = "",
        status = "ALL",
        userId = "",
    }: Partial<ApiCallProps>) => {
        setLoading(true);
        let queryParams: any = {};
        if (page) {
            queryParams["page"] = page;
        }
        if (limit) {
            queryParams["limit"] = limit;
        }
        if (search_string) {
            queryParams["search_string"] = search_string;
        }
        if (sortBy) {
            queryParams["sort_by"] = sortBy;
        }
        if (sortType) {
            queryParams["sort_type"] = sortType;
        }
        if (selectedFarmId) {
            queryParams["farm_id"] = selectedFarmId;
        }
        if (status) {
            if (status !== "ALL") {
                queryParams["status"] = status;
            }
        }
        if (userId) {
            queryParams["assigned_to"] = userId;
        }

        const {
            page: pageCount,
            limit: limitCount,
            ...queryParamsUpdated
        } = queryParams;

        router.push({ query: queryParams });
        const paramString = prepareURLEncodedParams("", queryParamsUpdated);

        const response = await getAllProcurementService({
            page: page,
            limit: limit,
            paramString: paramString,
            accessToken,
        });
        if (response?.success) {
            const { data, ...rest } = response;
            const modifieData = addSerial(
                data,
                page,
                limit
            );
            setData(modifieData);
            setPaginationDetails(rest);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (router.isReady && accessToken) {
            let delay = 500;
            let debounce = setTimeout(() => {
                getAllProcurements({
                    page: 1,
                    limit: router.query.limit as string,
                    search_string: searchString,
                    sortBy: router.query.order_by as string,
                    sortType: router.query.order_type as string,
                    selectedFarmId: router.query.farm_id as string,
                    status: router.query.status as string,
                    userId: router.query.assigned_to as string,
                });
            }, delay);
            return () => clearTimeout(debounce);
        }
    }, [searchString, router.isReady, accessToken]);

    useEffect(() => {
        setSearchString(router.query.search_string as string);
    }, [router.query.search_string]);

    const onChangeSearch = (search: string) => {
        setSearchString(search);
    };
    const onSelectValueFromDropDown = async (value: FarmInTaskType) => {
        if (value) {
            setSelectedFarm(value);

            getAllProcurements({
                page: 1,
                limit: router.query.limit as string,
                search_string: searchString,
                sortBy: router.query.order_by as string,
                sortType: router.query.order_type as string,
                selectedFarmId: value?._id,
                status: router.query.status as string,
                userId: router.query.assigned_to as string,
            });
        } else {
            setSelectedFarm(null);
            getAllProcurements({
                page: 1,
                limit: router.query.limit as string,
                search_string: searchString,
                sortBy: router.query.order_by as string,
                sortType: router.query.order_type as string,
                selectedFarmId: "",
                status: router.query.status as string,
                userId: router.query.assigned_to as string,
            });
        }
    };

    const onStatusChange = async (value: any) => {
        getAllProcurements({
            page: 1,
            limit: router.query.limit as string,
            search_string: searchString,
            sortBy: router.query.order_by as string,
            sortType: router.query.order_type as string,
            selectedFarmId: router.query.farm_id as string,
            status: value,
            userId: router.query.assigned_to as string,
        });
    };

    const onUserChange = async (e: any, value: userTaskType) => {
        getAllProcurements({
            page: 1,
            limit: router.query.limit as string,
            search_string: searchString,
            sortBy: router.query.order_by as string,
            sortType: router.query.order_type as string,
            selectedFarmId: router.query.farm_id as string,
            status: router.query.status as string,
            userId: value?._id as string,
        });
    };

    return (
        <div style={{ padding: "1rem 2rem" }}>
            <ProcurementNavBarContainer
                onChangeSearch={onChangeSearch}
                searchString={searchString}
                onSelectValueFromDropDown={onSelectValueFromDropDown}
                selectedFarm={selectedFarm}
                onStatusChange={onStatusChange}
                onUserChange={onUserChange}
                titleName={"Procurment Module"}
            />
            {data.length ? (
                <ProcurementsTableComponent
                    data={data}
                    getData={getAllProcurements}
                    paginationDetails={paginationDetails}
                />
            ) : !loading ? (
                <div
                    style={{
                        justifyContent: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <ImageComponent
                        src="/no-tasks-data.svg"
                        height={500}
                        width={500}
                        alt="no-tasks"
                    />
                    {/* <ImageComponent
                            src="/Nodata-animated-img.svg"
                            height={500}
                            width={500}
                            alt="no-tasks"
                        /> */}
                    <div
                        style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                            color: "#a05148",
                        }}
                    >
                        No Procurements
                    </div>
                </div>
            ) : (
                ""
            )}

            <LoadingComponent loading={loading} />
        </div>
    );
};

export default ListProcurments;
