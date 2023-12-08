const LatestImagesComponent = ({ data }: any) => {
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(18%, 1fr))",
            gridGap: "1px",
            overflowY: "auto",
            maxHeight: "550px",
            width: "100%"
        }}>
            {data?.length ?
                data.map((item: any, index: any) => {
                    return (
                        <div key={index} style={{ position: "relative", paddingTop: "100%", width: "100%" }}
                        >
                            <img
                                className="your-image-class"
                                key={index}

                                src={
                                    item.type?.slice(0, 2) == "vi"
                                        ? "/Play-button.svg"
                                        : item.url
                                }
                                alt={item?.uploaded_at}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    position: "absolute",
                                    objectFit: "cover",
                                    top: "0",
                                    right: "0",
                                }}

                            />

                        </div>
                    )
                })
                : ""}

        </div>
    )
}
export default LatestImagesComponent;