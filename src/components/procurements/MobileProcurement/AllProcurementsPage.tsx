import { addSerial } from "@/pipes/addSerial";
import getAllProcurementService from "../../../../lib/services/ProcurementServices/getAllProcrumentService";
import { prepareURLEncodedParams } from "../../../../lib/requestUtils/urlEncoder";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import { ApiCallProps } from "../procurementsTable/ListProcurements";
import ProcurementCard from "./ProcurementCard";
import { useCookies } from "react-cookie";
import ProcurementHeader from "./ProcurementHeader";
import Tabs from "@/components/Tasks/MobileTasksComponents/tabs";
import { Button, IconButton } from "@mui/material";
import styles from "./all-procurement.module.css";
import ProcurementTabs from "./ProcurementTabs";
import Image from "next/image";

const MobileAllProcurements = () => {
    const router = useRouter();
    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );
    const userDetails = useSelector(
        (state: any) => state.auth.userDetails?.user_details
    );

    const [data, setData] = useState<any>();
    const [page, setPage] = useState(1);

    const [paginationDetails, setPaginationDetails] = useState();
    const [loading, setLoading] = useState(true);
    const [searchString, setSearchString] = useState<any>("");
    const [selectedFarm, setSelectedFarm] = useState<any>();
    const [hasMore, setHasMore] = useState(true);
    const [, , removeCookie] = useCookies(["userType"]);
    const [, , loggedIn] = useCookies(["loggedIn"]);
    const [dateFilter, setDateFilter] = useState("");
    const userId = useSelector(
        (state: any) => state.auth.userDetails?.user_details?._id
    );
    const [user, setUser] = useState<any>([]);
    const [selectedUsers, setSelectedUsers] = useState<
        { name: string; _id: string }[] | null
    >();

    //logout event
    const logout = async () => {
        try {
            removeCookie("userType");
            loggedIn("loggedIn");
            router.push("/");
        } catch (err: any) {
            console.error(err);
        }
    };

    //get all procurements api
    const getAllProcurements = async ({
        page = 1,
        limit = 15,
        search_string = router.query.search_string,
        sortBy = "createdAt",
        sortType = "desc",
        selectedFarmId = "",
        status = "ALL",
        priority = "ALL",
        userId = [],
        isMyProcurements = false,
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
        if (Boolean(isMyProcurements)) {
            queryParams["is_my_procurement"] = true;
        }

        const {
            page: pageCount,
            limit: limitCount,
            is_my_procurement,
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

    //scoll to the last element after next page api call
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

    //to get the last element in the Dom
    const lastBookElementRef = useCallback(
        (node: any) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore && data.length > 0) {
                    setPage((prevPageNumber) => prevPageNumber + 1);
                    getAllProcurements({
                        page: page + 1,
                        limit: router.query.limit as string,
                        search_string: router.query.search_string as string,
                        sortBy: router.query.sort_by as string,
                        sortType: router.query.sort_type as string,
                        selectedFarmId: router.query.farm_id as string,
                        status: router.query.status as string,
                        priority: router.query.priority as string,
                        userId: router.query.requested_by
                            ? Array.isArray(router.query.requested_by)
                                ? (router.query.requested_by as string[])
                                : ([router.query.requested_by] as string[])
                            : [],
                        isMyProcurements: router.query.is_my_procurement as string,
                    });
                    scrollToLastItem(); // Restore scroll position after new data is loaded
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    useEffect(() => {
        if (router.isReady && accessToken) {
            setSearchString(router.query.search_string as string);

            getAllProcurements({
                page: 1,
                limit: router.query.limit as string,
                search_string: router.query.search_string,
                sortBy: router.query.sort_by as string,
                sortType: router.query.sort_type as string,
                selectedFarmId: router.query.farm_id as string,
                status: router.query.status as string,
                priority: router.query.priority as string,
                userId: router.query.requested_by
                    ? Array.isArray(router.query.requested_by)
                        ? (router.query.requested_by as string[])
                        : ([router.query.requested_by] as string[])
                    : [],
                isMyProcurements: router.query.is_my_procurement as string,
            });
        }
    }, [router.isReady, accessToken]);


    useEffect(() => {
        if (router.isReady && accessToken && searchString) {
            let delay = 500;
            let debounce = setTimeout(() => {
                getAllProcurements({
                    page: 1,
                    limit: router.query.limit as string,
                    search_string: searchString,
                    sortBy: router.query.sort_by as string,
                    sortType: router.query.sort_type as string,
                    selectedFarmId: router.query.farm_id as string,
                    status: router.query.status as string,
                    priority: router.query.priority as string,
                    userId: router.query.requested_by
                        ? Array.isArray(router.query.requested_by)
                            ? (router.query.requested_by as string[])
                            : ([router.query.requested_by] as string[])
                        : [],
                    isMyProcurements: router.query.is_my_procurement as string,
                });
            }, delay);
            return () => clearTimeout(debounce);
        }
    }, [searchString, accessToken, router.isReady]);

    //on change the search string event
    const onChangeSearch = (search: string) => {
        if (search) {
            setSearchString(search);
        }
        else {
            setSearchString("")
            getAllProcurements({
                page: 1,
                limit: router.query.limit as string,
                search_string: "",
                sortBy: router.query.sort_by as string,
                sortType: router.query.sort_type as string,
                selectedFarmId: router.query.farm_id as string,
                status: router.query.status as string,
                priority: router.query.priority as string,
                userId: router.query.requested_by
                    ? Array.isArray(router.query.requested_by)
                        ? (router.query.requested_by as string[])
                        : ([router.query.requested_by] as string[])
                    : [],
                isMyProcurements: router.query.is_my_procurement as string,
            });
        }
    };

    //userdropdown onChange event
    const onUserChange = async (
        value: string[] | [],
        isMyProcurements = false
    ) => {
        if (value.length) {
            getAllProcurements({
                page: 1,
                limit: router.query.limit as string,
                search_string: router.query.search_string as string,
                createdAt: dateFilter,
                sortBy: router.query.sort_by as string,
                sortType: router.query.sort_type as string,
                selectedFarmId: router.query.farm_id as string,
                status: router.query.status as string,
                userId: value,
                priority: router.query.priority as string,
                isMyProcurements: isMyProcurements,
            });
        }
        else {
            getAllProcurements({
                page: 1,
                limit: router.query.limit as string,
                search_string: router.query.search_string as string,
                createdAt: dateFilter,
                sortBy: router.query.sort_by as string,
                sortType: router.query.sort_type as string,
                selectedFarmId: router.query.farm_id as string,
                status: router.query.status as string,
                userId: [],
                priority: router.query.priority as string,
                isMyProcurements: isMyProcurements,
            });
        }
    };

    //status onChange Event
    const onStatusChange = async (value: any) => {
        getAllProcurements({
            page: 1,
            limit: router.query.limit as string,
            search_string: router.query.search_string as string,
            createdAt: dateFilter,
            sortBy: router.query.sort_by as string,
            sortType: router.query.sort_type as string,
            selectedFarmId: router.query.farm_id as string,
            status: value,
            userId: router.query.requested_by
                ? Array.isArray(router.query.requested_by)
                    ? (router.query.requested_by as string[])
                    : ([router.query.requested_by] as string[])
                : [],
            isMyProcurements: router.query?.is_my_procurement as string,
        });
    };

    return (
        <div>
            <ProcurementHeader
                onChangeSearch={onChangeSearch}
                searchString={searchString}
                onUserChange={onUserChange}
                getAllTasks={getAllProcurements}
            />
            <div className={styles.allTasksPage}>
                <div className={styles.TabButtonGrp}>
                    <Button
                        className={
                            router.query.is_my_procurement !== "true"
                                ? styles.tabActiveButton
                                : styles.tabButton
                        }
                        onClick={() => {
                            if (!(router.query.is_my_procurement == "true")) {
                                return;
                            }
                            setUser([]);
                            setSelectedUsers([]);

                            getAllProcurements({
                                page: router.query.page as string,
                                limit: router.query.limit as string,
                                search_string: router.query.search_string as string,
                                sortBy: router.query.sort_by as string,
                                sortType: router.query.sort_type as string,
                                selectedFarmId: router.query.farm_id as string,
                                status: router.query.status as string,
                                userId: [],
                                isMyProcurements: false,
                            });
                        }}
                    >
                        All Procurements
                    </Button>
                    <Button
                        className={
                            router.query.is_my_procurement == "true"
                                ? styles.tabActiveButton
                                : styles.tabButton
                        }
                        onClick={() => {
                            if (router.query.is_my_procurement == "true") {
                                return;
                            }
                            setUser([]);
                            setSelectedUsers([]);
                            onUserChange([userId], true);
                        }}
                    >
                        My Procurements
                    </Button>
                </div>
                <ProcurementTabs onStatusChange={onStatusChange} />

                <ProcurementCard
                    data={data}
                    lastBookElementRef={lastBookElementRef}
                    hasMore={hasMore}
                    lastItemRef={lastItemRef}
                    loading={loading}
                />
            </div>
            {userDetails?.user_type == "central_team" ? (
                ""
            ) : (
                <div className="addFormPositionIcon">
                    <IconButton
                        size="large"
                        className={styles.AddTaskBtn}
                        aria-label="add to shopping cart"
                        onClick={() => {
                            router.push("/users-procurements/add");
                        }}
                    >
                        <Image
                            src="/mobileIcons/procurement/add-procurement-icon.svg"
                            alt=""
                            width={25}
                            height={25}
                        />
                        <span>Add Procurement</span>
                    </IconButton>
                </div>
            )}
        </div>
    );
}

export default MobileAllProcurements;
