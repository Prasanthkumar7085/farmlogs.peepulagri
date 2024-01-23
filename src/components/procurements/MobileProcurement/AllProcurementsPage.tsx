import { addSerial } from "@/pipes/addSerial";
import getAllProcurementService from "../../../../lib/services/ProcurementServices/getAllProcrumentService";
import { prepareURLEncodedParams } from "../../../../lib/requestUtils/urlEncoder";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import { ApiCallProps } from "../procurementsTable/ListProcurements";
import ProcurementCard from "./ProcurementCard";
import { useCookies } from "react-cookie";

const MobileAllProcurements = () => {
    const router = useRouter();
    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );
    const [data, setData] = useState<any>();
    const [page, setPage] = useState(1);

    const [paginationDetails, setPaginationDetails] = useState();
    const [loading, setLoading] = useState(true);
    const [searchString, setSearchString] = useState("");
    const [selectedFarm, setSelectedFarm] = useState<any>();
    const [hasMore, setHasMore] = useState(true);
    const [, , removeCookie] = useCookies(["userType"]);
    const [, , loggedIn] = useCookies(["loggedIn"]);
    const logout = async () => {
        try {
            removeCookie("userType");
            loggedIn("loggedIn");
            router.push("/");
        } catch (err: any) {
            console.error(err);
        }
    };

    const getAllProcurements = async ({
        page = 1,
        limit = 15,
        search_string = "",
        sortBy = "",
        sortType = "",
        selectedFarmId = "",
        status = "ALL",
        priority = "ALL",
        userId = [],
        isMyTasks = false,
    }: any) => {
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
        if (priority) {
            if (priority !== "ALL") {
                queryParams["priority"] = priority;
            }
        }
        if (userId?.length) {
            queryParams["requested_by"] = userId;
            // queryParams["created_by"] = userId;
        }
        if (Boolean(isMyTasks)) {
            queryParams["is_my_task"] = true;
        }


        const {
            page: pageCount,
            limit: limitCount,
            is_my_task,
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
            if (page !== 1) {
                setHasMore(response?.has_more);
                setData([...data, ...response.data]);
            } else {
                setHasMore(response?.has_more);
                setData(response.data);
            }
        } else {
            setHasMore(false);
            setData(response.data);
        }
        if (response.status == 401) {
            logout();
        }
        setLoading(false)
    }
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
                    priority: router.query.priority as string,
                    userId: router.query.requested_by
                        ? Array.isArray(router.query.requested_by)
                            ? (router.query.requested_by as string[])
                            : ([router.query.requested_by] as string[])
                        : [],
                    isMyTasks: router.query.is_my_task as string,
                });
            }, delay);
            return () => clearTimeout(debounce);
        }
    }, [searchString, router.isReady, accessToken]);


    const lastItemRef = useRef<HTMLDivElement>(null);

    const scrollToLastItem = () => {
        if (lastItemRef.current) {
            lastItemRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
                inline: "nearest",
            });
        }
    };
    const observer: any = useRef();


    const lastBookElementRef = useCallback(
        (node: any) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore && data.length > 0) {
                    setPage((prevPageNumber) => prevPageNumber + 1);
                    getAllProcurements({
                        page: 1,
                        limit: router.query.limit as string,
                        search_string: searchString,
                        sortBy: router.query.order_by as string,
                        sortType: router.query.order_type as string,
                        selectedFarmId: router.query.farm_id as string,
                        status: router.query.status as string,
                        priority: router.query.priority as string,
                        userId: router.query.requested_by
                            ? Array.isArray(router.query.requested_by)
                                ? (router.query.requested_by as string[])
                                : ([router.query.requested_by] as string[])
                            : [],
                        isMyTasks: router.query.is_my_task as string,
                    });
                    scrollToLastItem(); // Restore scroll position after new data is loaded
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    return (
        <div>
            <ProcurementCard data={data}
                lastBookElementRef={lastBookElementRef}
                hasMore={hasMore}
                lastItemRef={lastItemRef}
                loading={loading} />
        </div>
    );
}

export default MobileAllProcurements;
