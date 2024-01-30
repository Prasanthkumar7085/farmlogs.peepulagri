import { Typography } from "@mui/material";
import styles from "./scoutingComments.module.css";
import Image from "next/image";
import CommentsComponentForWeb from "@/components/Scouting/Comments/CommentsComponentForweb";
const ScoutingComments = ({ rightBarOpen, setRightBarOpen, imageDetails, setImageDetails }: any) => {
    return (
        <div>
            <div className={styles.RecommedationBlock}>
                <Typography variant="h6" className={styles.RecommedationHeading}>
                    <Image src="/chat-scout-icon.svg" alt="" width={12} height={12} />
                    Comments
                </Typography>
                <hr></hr>
                <CommentsComponentForWeb scoutDetails={imageDetails} attachement={imageDetails} />
            </div>
        </div>
    )
}
export default ScoutingComments;