import ScoutingFarmDetailsCard from "./FarmDetailsCard";
import FarmsNavBarWeb from "./FarmsNavBar";
import styles from "./FarmsNavBar.module.css";
const AllFarmsPage = () => {
    return (
        <div className={styles.AllFarmsPageWeb}>
            <FarmsNavBarWeb />
            <div className={styles.allFarms}>
                <ScoutingFarmDetailsCard />

            </div>
        </div>
    );
}

export default AllFarmsPage;