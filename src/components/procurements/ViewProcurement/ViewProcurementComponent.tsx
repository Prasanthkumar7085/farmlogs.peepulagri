import { useEffect, useState } from "react";
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
  const [data, setData] = useState<any>()
  console.log(data, "mk")
  const getProcurementById = async () => {
    try {
      const response = await getProcurementByIdService({
        procurementId: router.query.procurement_id as string,
        accessToken: accessToken,
      });
      if (response.status == 200 || response.status == 201) {
        setData(response?.data)
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
    <div style={{ width: "50%", margin: "auto" }}>
      <ShippedStatus data={data} />
      <ShippedStatusform data={data} />
      <ViewProcurementTable data={data} />
    </div>
  );
};

export default ViewProcurementComponent;
