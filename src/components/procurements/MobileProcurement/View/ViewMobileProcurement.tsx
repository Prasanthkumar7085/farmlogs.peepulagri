import { useRouter } from "next/router";
import ViewProcurementHeader from "./viewProcurement-header";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import getProcurementByIdService from "../../../../../lib/services/ProcurementServices/getProcurementByIdService";
import { styled } from "@mui/material/styles";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";
import { Button, Stack, Stepper } from "@mui/material";
import Image from "next/image";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ViewProucrementMobileDetails from "./ViewProcurementMobileDetails";
import AddMaterialMobile from "../Add/AddMaterialMobile";
import ProcurementDetailsMobile from "../Add/procurement-details";
import getMaterialsByProcurementIdService from "../../../../../lib/services/ProcurementServices/getMaterialsByProcurementIdService";
import { toast } from "sonner";
import VendorDetails from "./VendorDetails";
import TrackingDetails from "./TrackingDetails";
import updateStatusService from "../../../../../lib/services/ProcurementServices/updateStatusService";
import LoadingComponent from "@/components/Core/LoadingComponent";
import styles from "./ViewProcurementMobile.module.css";
import MobileAddMaterialDrawer from "@/components/Core/MobileAddMaterialDrawer";
import { removeItems } from "@/Redux/Modules/Otp";
import RemarksBlock from "./RemarksBlock";
import ViewProcurementHeaderPage from "./ViewProcurementHeader";

const ViewMobileProcurement = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const userDetails = useSelector(
    (state: any) => state.auth.userDetails?.user_details
  );

  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [rejectedMaterials, setRejectedMaterial] = useState<any>();
  const [openMaterialDrawer, setOpenMaterialDrawer] = useState<boolean>();
  const [editMaterialId, setEditMaterialId] = useState("");

  let responseStatus: any;
  //overall status change
  const procurementStatusChange = async (status: string) => {
    setLoading(true);
    try {
      const response = await updateStatusService({
        procurement_id: data?._id || router.query.procurement_id,
        status: status,
        accessToken,
      });
      if (response?.success) {
        toast.success(response?.message)
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getProcurementById = async () => {
    try {
      const response = await getProcurementByIdService({
        procurementId: router.query.procurement_id as string,
        accessToken: accessToken,
      });
      if (response.status == 200 || response.status == 201) {
        setData(response?.data);

        responseStatus = response?.data?.status
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getAllProcurementMaterials = async () => {
    setLoading(true);
    try {
      let response = await getMaterialsByProcurementIdService({
        token: accessToken,
        procurementId: router.query.procurement_id as string,
      });
      if (response?.status == 200 || response?.status == 201) {
        const RejectFilterData = response?.data.filter(
          (obj: any) => obj.status == "REJECTED"
        );
        const remaining = response?.data.filter(
          (obj: any) => obj.status !== "REJECTED"
        );

        setMaterials(remaining);
        setRejectedMaterial(RejectFilterData);

      } else if (response?.status == 401) {
        toast.error(response?.message);
      } else {
        toast.error("Something went wrong");
        throw response;
      }
      if (response?.data) {
        const filteredData = response?.data.filter(
          (obj: any) => obj.status !== "REJECTED" && obj.hasOwnProperty("price")
        );
        const allPurchaseOrNot = filteredData.every(
          (obj: any) => obj.hasOwnProperty("price") && obj.price !== null
        );
        const allApprovedOrNot = response?.data.every((obj: any) => obj.status === "APPROVED") && responseStatus == "PENDING";

        if (
          allPurchaseOrNot &&
          filteredData?.length &&
          data?.status == "APPROVED"
        ) {
          await procurementStatusChange("PURCHASED");
          await afterMaterialStatusChange(true);
        }

        else if (allApprovedOrNot && response?.data?.length) {
          await procurementStatusChange("APPROVED");
          await afterMaterialStatusChange(true);

        }
        else {
          afterMaterialStatusChange(true);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //after chnage status
  const afterStatusChange = (value: any) => {
    if (value == true) {
      getProcurementById();
    }
  };
  const afterMaterialStatusChange = (value: any) => {
    if (value) {
      getProcurementById();
    }
  };

  useEffect(() => {
    if (router.isReady && accessToken) {
      getProcurementById();
      getAllProcurementMaterials()
      dispatch(removeItems([]));
    }
  }, [router.isReady, accessToken]);


  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 15,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundColor: "#05A155",
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundColor: "#05A155",
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor:
        theme.palette.mode === "dark" ? theme.palette.grey[800] : "#fff",
      borderRadius: 1,
    },
  }));

  const ColorlibStepIconRoot = styled("div")<{
    ownerState: { completed?: boolean; active?: boolean };
  }>(({ theme, ownerState }) => ({
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[700] : "#fff",
    zIndex: 1,
    color: "#fff",
    width: 30,
    height: 30,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    ...(ownerState.active && {
      backgroundColor: "#05A155",
      boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
    }),
    ...(ownerState.completed && {
      backgroundColor: "#05A155",
    }),
  }));

  function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;
    //for completed step use this icon
    // <Image src="/viewProcurement/tracking-icons/completed.svg" alt="" width={15} height={15}/>
    const icons: { [index: string]: React.ReactElement } = {
      0: (
        <Image
          src="/viewProcurement/tracking-icons/pending.svg"
          alt=""
          height={15}
          width={15}
        />
      ),
      1: (
        <Image
          src="/viewProcurement/tracking-icons/pending-icon.svg"
          alt=""
          height={15}
          width={15}
        />
      ),
      2: (
        <Image
          src="/viewProcurement/tracking-icons/approved-icon.svg"
          alt=""
          height={15}
          width={15}
        />
      ),
      3: (
        <Image
          src="/viewProcurement/tracking-icons/Purchase.svg"
          alt=""
          height={15}
          width={15}
        />
      ),
      4: (
        <LocalShippingIcon
          sx={{ color: "black", opacity: "0.7", fontSize: "small" }}
        />
      ),
      5: (
        <Image
          src="/viewProcurement/tracking-icons/Delivered.svg"
          alt=""
          height={15}
          width={15}
        />
      ),
      6: (
        <Image
          src="/viewProcurement/tracking-icons/completed-icon.svg"
          alt=""
          height={15}
          width={15}
        />
      ),
    };

    return (
      <ColorlibStepIconRoot
        ownerState={{ completed, active }}
        className={className}
      >
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }

  const steps = [
    "PENDING",
    "APPROVED",
    "PURCHASED",
    "SHIPPED",
    "DELIVERED",
    "COMPLETED",
  ];

  const activeStep = data ? steps.indexOf(data.status) : 0;

  return (
    <div>
      <ViewProcurementHeaderPage data={data} title={"View Procurement"} />
      <div className={styles.viewProcurementPage}>
        {data?.status ? (
          <Stack
            sx={{
              "& .MuiStepLabel-label": {
                color: "#000",
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(10px, 0.625vw, 13px)",
                fontWeight: "500",
                marginTop: "6px",
              },
            }}
            spacing={4}
          >
            <Stepper
              alternativeLabel
              activeStep={activeStep}
              connector={<ColorlibConnector />}
            >
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={ColorlibStepIcon}></StepLabel>
                </Step>
              ))}
            </Stepper>
          </Stack>
        ) : (
          ""
        )}
        <div className={styles.procurementDetailsBlock}>
          <ViewProucrementMobileDetails
            data={data}
            materials={materials}
            procurementStatusChange={procurementStatusChange}
            getProcurementById={getProcurementById}
          />
        </div>

        <div className={styles.procurementDetailsBlock}>
          {materials?.length || rejectedMaterials?.length ? (
            <ProcurementDetailsMobile
              materials={materials}
              procurementData={data}
              getAllProcurementMaterials={getAllProcurementMaterials}
              rejectedMaterials={rejectedMaterials}
              getProcurementById={getProcurementById}

            />
          ) : (
            loading == false && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Image
                  src={"/NoMaterialsImage.svg"}
                  height={150}
                  width={250}
                  alt="no materials"
                />
                {userDetails?.user_type == "central_team" ||
                  userDetails?.user_type == "agronomist" ||
                  userDetails?._id == data?.requested_by?._id ?
                  <Button
                    className={styles.addMaterialBtn}
                    onClick={() => {
                      setOpenMaterialDrawer(true);
                    }}
                  >
                    Add Material
                  </Button> : ""}

              </div>
            )
          )}
        </div>
        <div className={styles.vendarDetailsBlock}>
          {data?.remarks ? (
            <RemarksBlock procurementData={data} materials={materials} />
          ) : (
            ""
          )}
        </div>
        {/* <div className={styles.vendarDetailsBlock}>
          {materials?.some(
            (obj: any) =>
              obj.hasOwnProperty("vendor") &&
              obj.price !== null &&
              obj.price !== undefined &&
              obj.price !== ""
          ) ? (
            <VendorDetails procurementData={data} materials={materials} />
          ) : (
            ""
          )}
        </div> */}
        <div className={styles.trackingDetailsBlock}>
          {data?.status == "PURCHASED" || data?.tracking_details?._id ? (
            <TrackingDetails
              procurementData={data}
              materials={materials}
              procurementStatusChange={procurementStatusChange}
              getAllProcurementMaterials={getAllProcurementMaterials}
            />
          ) : (
            ""
          )}
        </div>
      </div>
      <MobileAddMaterialDrawer
        openMaterialDrawer={openMaterialDrawer}
        setOpenMaterialDrawer={setOpenMaterialDrawer}
        procurementData={data}
        getAllProcurementMaterials={getAllProcurementMaterials}
        editMaterialId={editMaterialId}
        setEditMaterialId={setEditMaterialId}
      />
      <LoadingComponent loading={loading} />
    </div>
  );
};
export default ViewMobileProcurement;