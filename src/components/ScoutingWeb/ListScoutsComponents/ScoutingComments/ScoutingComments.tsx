import { Typography } from "@mui/material";
import styles from "./scoutingComments.module.css";
import Image from "next/image";
import CommentsComponentForWeb from "@/components/Scouting/Comments/CommentsComponentForweb";
const ScoutingComments = ({ imageDetails }: any) => {
    return (
        <div>
            <div className={styles.RecommedationBlock} style={{ paddingTop: "1rem" }}>
                <Typography variant="h6" className={styles.RecommedationHeading}>
                    <Image src="/chat-scout-icon.svg" alt="" width={12} height={12} />
                    Comments
                </Typography>

                <CommentsComponentForWeb scoutDetails={imageDetails} attachement={imageDetails} />
            </div>
        </div>
    )
}
export default ScoutingComments;