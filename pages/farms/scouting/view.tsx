import SingleScoutingView from "@/components/Scouting/AllScouting/viewScouting";
import ViewHeader from "@/components/Scouting/Header/ViewHeader";

const ViewScouting = () => {
    return (
        <div>
            <ViewHeader name={'View'} />
            <SingleScoutingView />
        </div>
    );
}

export default ViewScouting;