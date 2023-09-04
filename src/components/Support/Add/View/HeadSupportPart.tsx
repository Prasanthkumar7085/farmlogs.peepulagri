import IconButtonComponent from "../../../Core/IconButtonComponent";
import { SupportResponseDataType } from "@/types/supportTypes";
import styles from "./../../../AddLogs/head-part.module.css";
import { Icon } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import getAllCategoriesService from "../../../../../lib/services/Categories/getAllCategoriesService";


const HeadSupportPart = ({ data }: { data: SupportResponseDataType | undefined }) => {

    const router = useRouter();


    const [categories, setCategoies] = useState([]);

    const getCategories = async () => {
        const response = await getAllCategoriesService();
        if (response.success) {
            setCategoies(response?.data)
        }

    }

    useEffect(() => {
        getCategories();
    }, [])

    const getCategoriesList = (list: any) => {

        let array = categories.map((categoryItem: any) => {
            if (list && list.includes(categoryItem?.slug)) {
                return categoryItem?.category
            }
        }).filter((e) => e)

        return array?.join(', ')
    }


    return (
        <div className={styles.headPart}>
            <div className={styles.subHeading}>
                <IconButtonComponent
                    icon={<Icon>arrow_back_sharp</Icon>}
                    onClick={() => router.back()}
                    size="small"
                    />
                <h4 className={styles.text}>View Support</h4>
            </div>
            <div className={styles.headerContent}>
                <div className={styles.label}>
                    <div className={styles.dropdownText}>{getCategoriesList(data?.categories)}</div>
                </div>
                <div className={styles.content}>
                    <h3 className={styles.h3title}>
                        {data?.title}
                    </h3>
                    <p className={styles.pdescription}>
                        <span className={styles.identifyingSpecificPests}>
                            {data?.description}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default HeadSupportPart;