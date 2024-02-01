import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import getProcurementByIdService from "../../../../lib/services/ProcurementServices/getProcurementByIdService";
import ShippedStatus from "./shipped-status";
import ShippedStatusform from "./shipped-statusform";
import ViewProcurementTable from "./ViewProcerementTable";
import { styled } from '@mui/material/styles';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import { Stack, Stepper } from "@mui/material";
import Image from "next/image";

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
  const afterMaterialStatusChange = (value: any) => {
    if (value) {
      getProcurementById();
    }
  }

  useEffect(() => {
    if (router.isReady && accessToken) {
      getProcurementById();
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

    const icons: { [index: string]: React.ReactElement } = {
      0: <Image src="/viewProcurement/tracking-icons/pending.svg" alt="" height={15} width={15} />,
      1: <Image src="/viewProcurement/tracking-icons/pending.svg" alt="" height={15} width={15} />,
      2: <Image src="/viewProcurement/tracking-icons/approved.svg" alt="" height={15} width={15} />,
      3: <Image src="/viewProcurement/tracking-icons/purchased.svg" alt="" height={15} width={15} />,
      4: <Image src="/viewProcurement/tracking-icons/shipped.svg" alt="" height={15} width={15} />,
      5: <Image src="/viewProcurement/tracking-icons/completed.svg" alt="" height={15} width={15} />,
      6: <Image src="/viewProcurement/tracking-icons/completed.svg" alt="" height={15} width={15} />,
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
    <div style={{ width: "90%", margin: "auto", paddingTop: "1rem" }}>
      {data?.status ?
        <Stack sx={{
          width: '50%', margin: "0 auto 1rem", '& .MuiStepLabel-label': {
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
      <ShippedStatus data={data} afterStatusChange={afterStatusChange} />
      <ShippedStatusform data={data} afterStatusChange={afterStatusChange} />
      <ViewProcurementTable data={data} afterMaterialStatusChange={afterMaterialStatusChange} />
    </div>
  );
};

export default ViewProcurementComponent;
