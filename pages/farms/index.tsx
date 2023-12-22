import DashboardPage from "@/components/Scouting/Dashboad/DashboardPage";

const Dashboard = () => {
  return (
    <div id="mobileDashboard">
      <DashboardPage />
    </div>
  );
};

export default Dashboard;

// export const getServerSideProps: GetServerSideProps = async (context: any) => {
//   const { req } = context;
//   const { cookies } = req;

//   const isMobile = /iPhone|iPad|iPod|Android/i.test(req.headers["user-agent"]);
//   console.log("kiopkjoimhiuhn", req.headers["user-agent"]);

//   //   if (isMobile) {
//   //     return {
//   //       redirect: {
//   //         destination: `/farms`,
//   //         permanent: false,
//   //       },
//   //     };
//   //   }

//   if (!(cookies.loggedIn_v2 == "true")) {
//     return {
//       redirect: {
//         destination: `/`,
//         permanent: false,
//       },
//     };
//   } else if (
//     cookies.userType_v2 == "agronomist" ||
//     cookies.userType_v2 == "admin"
//   ) {
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
