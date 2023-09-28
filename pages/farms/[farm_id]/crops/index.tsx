import AllCropsComponent from "@/components/Scouting/Crops/AllCropsComponent"
import Header1 from "@/components/Scouting/Header/HeaderComponent"

const AllCropsPage = () => {
    return (
        <div>
            <Header1 name={"My Crops"} />

            <AllCropsComponent />
        </div>
    )
}
export default AllCropsPage