import Image from "next/image"

const ImageComponent = (rest: any) => {

    return (
        <div style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>

            <Image {...rest} style={{ maxWidth: "100%" }} />
        </div>
    )
}
export default ImageComponent