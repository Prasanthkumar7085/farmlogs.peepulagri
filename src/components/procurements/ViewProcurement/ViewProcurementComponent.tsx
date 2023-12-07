import { useEffect } from "react";
import ShippedStatus from "./shipped-status";
import ShippedStatusform from "./shipped-statusform";
import ViewProcurementTable from "./table";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import getProcurementByIdService from "../../../../lib/services/ProcurementServices/getProcurementByIdService";

const ViewProcurementComponent = () => {
  const router = useRouter();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const getProcurementById = async () => {
    try {
      const response = await getProcurementByIdService({
        procurementId: router.query.procurement_id as string,
        accessToken: accessToken,
      });
      if (response.status == 200 || response.status == 201) {
        console.log(response);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (router.isReady && accessToken) {
      getProcurementById();
    }
  }, [router.isReady, accessToken]);
  return (
    <div>
      <ShippedStatus />
      <ShippedStatusform />
      <ViewProcurementTable />
    </div>
  );
};

export default ViewProcurementComponent;
