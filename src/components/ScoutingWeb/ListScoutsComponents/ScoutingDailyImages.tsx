import {
  ScoutAttachmentDetails,
  SingleScoutResponse,
} from "@/types/scoutTypes";

interface propTypes {
  item: SingleScoutResponse;
  onClickAttachment: (attachmentId: string) => void;
}
const ScoutingDailyImages: React.FC<propTypes> = ({
  item,
  onClickAttachment,
}) => {
  return (
    <div>
      {item?.attachments?.length
        ? item?.attachments?.map(
            (imageItem: ScoutAttachmentDetails, index: number) => {
              return (
                <div
                  key={index}
                  style={{
                    minHeight: "100px",
                    minWidth: "100px",
                    border: "1px solid red",
                  }}
                  onClick={() => onClickAttachment(imageItem._id)}
                >
                  {/* <img
                    src={imageItem?.url}
                    height={100}
                    width={100}
                    alt={imageItem.original_name}
                  /> */}
                </div>
              );
            }
          )
        : ""}
    </div>
  );
};

export default ScoutingDailyImages;
