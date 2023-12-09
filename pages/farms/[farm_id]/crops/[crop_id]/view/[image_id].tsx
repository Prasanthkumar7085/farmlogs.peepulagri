import SingleImageView from "@/components/Core/SingleImageView";
import ScoutView from "@/components/Scouting/Crops/Scouts/ScoutView";
import SingleImageComponent from "@/components/Scouting/Crops/Scouts/SingleImageComponent";
import Header1 from "@/components/Scouting/Header/HeaderComponent";

const ScoutViewPage = () => {
  return (
    <div style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}>
      {/* <Header1 name={"Scouting"} />

      <ScoutView /> */}
      <SingleImageView detailedImage="" scoutDetails="" getImageData="" />
    </div>
  );
};
export default ScoutViewPage;
