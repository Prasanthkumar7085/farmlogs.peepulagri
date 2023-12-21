import { useRouter } from "next/router";

const LatestImagesComponent = ({ data }: any) => {
    const router = useRouter();
    return (
      <div
        style={{
          display: "grid",
          //   gridTemplateColumns: "repeat(auto-fill, minmax(18%, 1fr))",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gridGap: "1px",
          overflowY: "auto",
          maxHeight: "350px",
          width: "100%",
        }}
      >
        {data?.length
          ? data.map((item: any, index: any) => {
              return (
                <div
                  key={index}
                  style={{
                    position: "relative",
                    paddingTop: "100%",
                    width: "100%",
                  }}
                >
                  <picture>
                    <img
                      key={index}
                      src={
                        item.type?.slice(0, 2) == "vi"
                          ? "/Play-button.svg"
                          : item.url
                      }
                      onClick={() =>
                        router.push(
                          `/farms/${item?.farm_id?._id}/crops/${item?.crop_id?._id}/view/${item?._id}`
                        )
                      }
                      alt={item?.uploaded_at}
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        objectFit: "cover",
                        top: "0",
                        right: "0",
                        cursor: "pointer",
                      }}
                    />
                  </picture>
                </div>
              );
            })
          : ""}
      </div>
    );
}
export default LatestImagesComponent;