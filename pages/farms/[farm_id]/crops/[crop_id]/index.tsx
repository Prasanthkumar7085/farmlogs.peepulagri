import ImageGalleryComponent from "@/components/Scouting/Crops/ImageGalleryComponent";
import Header1 from "@/components/Scouting/Header/HeaderComponent";
import { Button } from "@mui/material";
import { GetServerSideProps } from "next";

const ImageGalleryPage = () => {

  return (
    <div style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}>
      <ImageGalleryComponent />
    </div>
  )
}
export default ImageGalleryPage;




// export const getServerSideProps: GetServerSideProps = async (context: any) => {
//   const { req } = context;
//   const { cookies } = req;

//   if (!(cookies.loggedIn == "true")) {
//     return {
//       redirect: {
//         destination: `/`,
//         permanent: false,
//       },
//     };
//   } else if (cookies.userType == "ADMIN") {
//     return {
//       redirect: {
//         destination: `/scouts`,
//         permanent: false,
//       },
//     };
//   }
//   return {
//     props: {},
//   };
// };
