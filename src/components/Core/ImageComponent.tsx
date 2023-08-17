import Image from "next/image"

const ImageComponent = (rest: any) => {

    return (
        <div style={{ textAlign: "center" }}>
            <Image {...rest} />
        </div>
    )
}
export default ImageComponent