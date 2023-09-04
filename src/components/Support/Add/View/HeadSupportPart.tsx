import HeadPart from "@/components/AddLogs/head-part";
import ButtonComponent from "@/components/Core/ButtonComponent";
import { SupportResponseDataType } from "@/types/supportTypes";
import styles from "./../../../AddLogs/head-part.module.css";
import { Icon } from "@mui/material";
import { useRouter } from "next/router";


const HeadSupportPart = ({ data }: { data: SupportResponseDataType | undefined }) => {

    const router = useRouter();

    const getLabel = (item: string) => {
        const categoryOptions = [

            { title: 'Input Resources', value: "input_resources", color: "#66BB6A" },
            { title: 'Irrigation', value: "irrigation", color: "#64B5F6" },
            { title: 'Tools', value: "tools", color: "#FFD54F" },
            { title: 'Harvesting', value: "harvesting", color: "#AB47BC" },
            { title: 'Alerts', value: "alerts", color: "#AED581" },
            { title: 'Notifications', value: "notifications", color: "#9575CD" },
            { title: 'Climate & Weather', value: "climate_and_weather", color: "#FF8A65" },
            { title: 'Dashboard', value: "dashboard", color: "#FFD700" },
            { title: 'New Features', value: "new_features", color: "#FF80AB" },
            { title: 'Data Analysis', value: "data_analysis", color: "#78909C" },
            { title: 'Bug & Trouble Shooting', value: "bug_and_touble_shooting", color: "#26A69A" },
        ];


        return (categoryOptions.find((categoryItem: { title: string, value: string }) => categoryItem.value.toLowerCase() == item.toLowerCase()))?.title
    }

    const getCategories = (categories: Array<string> | undefined) => {
        return categories && categories.length && categories.map((item: string) => getLabel(item)).join(', ')

    }

    return (
        <div className={styles.headPart}>
            <div className={styles.subHeading}>
                <ButtonComponent
                    direction={false}
                    title='Back'
                    icon={<Icon>arrow_back_sharp</Icon>}
                    onClick={() => router.back()}
                />
                <h4 className={styles.text}>View Support</h4>
            </div>
            <div className={styles.headerContent}>
                <div className={styles.label}>
                    <div className={styles.dropdownText}>{getCategories(data?.categories)}</div>
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