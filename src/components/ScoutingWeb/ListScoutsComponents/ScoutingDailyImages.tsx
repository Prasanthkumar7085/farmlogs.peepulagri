import {
  ScoutAttachmentDetails,
  SingleScoutResponse,
} from "@/types/scoutTypes";

interface propTypes {
  item: SingleScoutResponse;
}
const ScoutingDailyImages: React.FC<propTypes> = ({ item }) => {
  return (
    <div>
      {item?.attachments?.length
        ? item?.attachments?.map(
            (imageItem: ScoutAttachmentDetails, index: number) => {
              return (
                <img
                  src={imageItem?.url}
                  height={100}
                  width={100}
                  alt={imageItem.original_name}
                />
              );
            }
          )
        : ""}
    </div>
  );
};

export default ScoutingDailyImages;
