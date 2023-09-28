import AllCropsComponent from "@/components/Scouting/Crops/AllCropsComponent"
import HeaderComponentAllCrops from "@/components/Scouting/Header/HeaderComponentAllCrops"

const AllCropsPage = () => {
    return (
        <div>
            <HeaderComponentAllCrops name={"My Crops"} />

            <AllCropsComponent />
        </div>
    )
}
export default AllCropsPage