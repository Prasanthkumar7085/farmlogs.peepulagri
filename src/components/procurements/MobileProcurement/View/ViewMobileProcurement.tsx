import { useRouter } from "next/router";
import ViewProcurementHeader from "./viewProcurement-header";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import getProcurementByIdService from "../../../../../lib/services/ProcurementServices/getProcurementByIdService";
import { styled } from '@mui/material/styles';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import { Stack, Stepper } from "@mui/material";
import Image from "next/image";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ViewProucrementMobileDetails from "./ViewProcurementMobileDetails";
import AddMaterialMobile from "../Add/AddMaterialMobile";
import ProcurementDetailsMobile from "../Add/procurement-details";
import getMaterialsByProcurementIdService from "../../../../../lib/services/ProcurementServices/getMaterialsByProcurementIdService";
import { toast } from "sonner";
import VendorDetails from "./VendorDetails";
import TrackingDetails from "./TrackingDetails";
import updateStatusService from "../../../../../lib/services/ProcurementServices/updateStatusService";

const ViewMobileProcurement = () => {
    const router = useRouter();
    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );
    const [data, setData] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [materials, setMaterials] = useState([]);
    const [rejectedMaterials, setRejectedMaterial] = useState<any>()

    //overall status change
    const procurementStatusChange = async (status: string) => {
        try {
            const response = await updateStatusService({
                procurement_id: data?._id,
                status: status,
                accessToken,
            });
        }
        catch (err) {
            console.error(err)
        }
    }

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

    const getAllProcurementMaterials = async () => {
        setLoading(true);
        try {
            let response = await getMaterialsByProcurementIdService({
                token: accessToken,
                procurementId: router.query.procurement_id as string,
            });
            if (response?.status == 200 || response?.status == 201) {
                const RejectFilterData = response?.data.filter((obj: any) => obj.status == "REJECTED")
                const remaining = response?.data.filter((obj: any) => obj.status !== "REJECTED");

                setMaterials(remaining);
                setRejectedMaterial(RejectFilterData)
            } else if (response?.status == 401) {
                toast.error(response?.message);
            } else {
                toast.error("Something went wrong");
                throw response;
            }
            if (response?.data) {

                const filteredData = response?.data.filter((obj: any) => obj.status !== "REJECTED" && obj.hasOwnProperty('price'));
                const allPurchaseOrNot = filteredData.every((obj: any) => obj.hasOwnProperty('price') && obj.price !== null);

                if (allPurchaseOrNot && filteredData?.length) {
                    await procurementStatusChange("PURCHASED")
                    await afterMaterialStatusChange(true)
                }
                else {
                    afterMaterialStatusChange(true)
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
    }

    useEffect(() => {
        if (router.isReady && accessToken) {
            getProcurementById();
            getAllProcurementMaterials()
        }
    }, [router.isReady, accessToken]);

    const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
        [`&.${stepConnectorClasses.alternativeLabel}`]: {
            top: 15,
        },
        [`&.${stepConnectorClasses.active}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                backgroundColor:
                    '#05A155',
            },
        },
        [`&.${stepConnectorClasses.completed}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                backgroundColor:
                    '#05A155',
            },
        },
        [`& .${stepConnectorClasses.line}`]: {
            height: 3,
            border: 0,
            backgroundColor:
                theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#fff',
            borderRadius: 1,
        },
    }));

    const ColorlibStepIconRoot = styled('div')<{
        ownerState: { completed?: boolean; active?: boolean };
    }>(({ theme, ownerState }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#fff',
        zIndex: 1,
        color: '#fff',
        width: 30,
        height: 30,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        ...(ownerState.active && {
            backgroundColor:
                '#05A155',
            boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
        }),
        ...(ownerState.completed && {
            backgroundColor:
                '#05A155',
        }),
    }));

    function ColorlibStepIcon(props: StepIconProps) {
        const { active, completed, className } = props;
        //for completed step use this icon
        // <Image src="/viewProcurement/tracking-icons/completed.svg" alt="" width={15} height={15}/>
        const icons: { [index: string]: React.ReactElement } = {
            0: <Image src="/viewProcurement/tracking-icons/pending.svg" alt="" height={15} width={15} />,
            1: <Image src="/viewProcurement/tracking-icons/pending-icon.svg" alt="" height={15} width={15} />,
            2: <Image src="/viewProcurement/tracking-icons/approved-icon.svg" alt="" height={15} width={15} />,
            3: <Image src="/viewProcurement/tracking-icons/Purchase.svg" alt="" height={15} width={15} />,
            4: <LocalShippingIcon sx={{ color: "black", opacity: "0.7" }} />,
            5: <Image src="/viewProcurement/tracking-icons/Delivered.svg" alt="" height={15} width={15} />,
            6: <Image src="/viewProcurement/tracking-icons/completed-icon.svg" alt="" height={15} width={15} />,
        };

        return (
            <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
                {icons[String(props.icon)]}
            </ColorlibStepIconRoot>
        );
    }

    const steps = ['PENDING', 'APPROVED', 'PURCHASED', 'SHIPPED', 'DELIVERED', 'COMPLETED'];

    const activeStep = data ? steps.indexOf(data.status) : 0;

    return (
        <div >
            <ViewProcurementHeader title={"View Procurement"} />
            {/* <div >
                {data?.status ?
                    <Stack sx={{
                        width: '50%', '& .MuiStepLabel-label': {
                            color: "#000",
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "clamp(10px, 0.625vw, 13px)",
                            fontWeight: "500",
                            marginTop: "6px"
                        }
                    }} spacing={4}>

                        <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                            {steps.map((label, index) => (
                                <Step key={label}>
                                    <StepLabel StepIconComponent={ColorlibStepIcon}>
                                        {label}
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Stack> : ""}
            </div> */}
            <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "0.5rem" }}>
                <ViewProucrementMobileDetails data={data}
                    materials={materials}
                />
            </div>

            <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", justifyContent: "center", }}>
                {materials?.length || rejectedMaterials?.length ?
                    <ProcurementDetailsMobile
                        materials={materials}
                        procurementData={data}
                        getAllProcurementMaterials={getAllProcurementMaterials}
                        rejectedMaterials={rejectedMaterials}
                    />
                    : ""}
            </div>
            <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", justifyContent: "center", }}>
                {materials?.length ?
                    <VendorDetails
                        procurementData={data}
                        materials={materials}

                    />
                    : ""}
            </div>
            <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", justifyContent: "center", }}>
                {materials?.length ?
                    <TrackingDetails
                        procurementData={data}
                        materials={materials}
                        procurementStatusChange={procurementStatusChange} />
                    : ""}
            </div>
        </div >

    )
}
export default ViewMobileProcurement;