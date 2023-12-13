import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import getProcurementByIdService from "../../../../lib/services/ProcurementServices/getProcurementByIdService";
import ShippedStatus from "./shipped-status";
import ShippedStatusform from "./shipped-statusform";
import ViewProcurementTable from "./table";

const ViewProcurementComponent = () => {
  const router = useRouter();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const [data, setData] = useState<any>();
  const getProcurementById = async () => {
    try {
      const response = await getProcurementByIdService({
        procurementId: router.query.procurement_id as string,
        accessToken: accessToken,
      });
      if (response.status == 200 || response.status == 201) {
        setData(response?.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  //after chnage status
  const afterStatusChange = (value: any) => {
    if (value == true) {
      getProcurementById();
    }
  };

  useEffect(() => {
    if (router.isReady && accessToken) {
      getProcurementById();
    }
  }, [router.isReady, accessToken]);
  return (
    <div style={{ width: "50%", margin: "auto" }}>
      <ShippedStatus data={data} afterStatusChange={afterStatusChange} />
      <ShippedStatusform data={data} />
      <ViewProcurementTable data={data} />
    </div>
  );
};

export default ViewProcurementComponent;
