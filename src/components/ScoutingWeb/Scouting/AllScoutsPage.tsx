import ScoutsNavBarWeb from "./ScoutsHeader";
import styles from "../farms/FarmsNavBar.module.css"
import ScoutingCardWeb from "./ScoutingCard";
const AllScoutsWebPage = () => {
    return (
        <div className={styles.AllFarmsPageWeb} style={{ paddingTop: "1rem !important" }}>
            <div className={styles.selectedForm}>
                <div className={styles.formCard}>
                    <img src="/farmshape.svg" alt="img" />
                    <div className={styles.formDetails}>
                        <h6>Farm1</h6>
                        <p>60 Acres</p>
                    </div>
                </div>
            </div>
            <ScoutsNavBarWeb />
            <div className={styles.allFarms} >
                <div className={styles.allScoutingCards}>
                    <ScoutingCardWeb />
                    <ScoutingCardWeb /> <ScoutingCardWeb /> <ScoutingCardWeb /> <ScoutingCardWeb />
                </div>
            </div>
        </div>
    );
}

export default AllScoutsWebPage;