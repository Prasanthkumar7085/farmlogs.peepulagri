import FarmCardsLayOut from "../FarmCard/FarmCardLayOut";
import FarmTableLogs from "./FarmTableLogs";


const DashBoard = () => {


    return (
        <div style={{ width: "100%" }}>
            <FarmCardsLayOut>
                <FarmTableLogs />
            </FarmCardsLayOut>
        </div>
    )
}

export default DashBoard;


