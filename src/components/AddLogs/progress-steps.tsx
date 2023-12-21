import styles from "./progress-steps.module.css";
import * as React from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Typography from '@mui/material/Typography';
import { useState } from "react";

const ProgressSteps = ({ activeStepsArray, activeStepBasedOnData }: { activeStepsArray: Array<boolean>, activeStepBasedOnData: number }) => {

  const steps = [
    {
      label: 'Work Type',
      description: `Choose type : Machinery & Manual or both`,
      isActive: activeStepsArray[0]
    },
    {
      label: 'Resources',
      description:
        'Add machinery like Tractors, Sprayers etc. (or) human resources ',
      isActive: activeStepsArray[1]
    },
    {
      label: 'Additional Resources',
      description: `You can add additional details based on the category and work type`,
      isActive: activeStepsArray[2]
    },
    {
      label: 'Attachments',
      description:
        'Attach images videos and documents related to the logs',
      isActive: activeStepsArray[3]
    },
  ];

  const [activeStep, setActiveStep] = useState(activeStepBasedOnData);
  React.useEffect(() => {
    setActiveStep(activeStepBasedOnData)
  }, [activeStepBasedOnData])

  return (
    <div className={styles.progressSteps} style={{ position: "sticky", top: "50px" }}>
      <div className={styles.card}>
        <div className={styles.progressStepsProgressIcon}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={index} completed={step.isActive}>
                <StepLabel sx={{ fontWeight: "600"}}>
                  {step.label}
                </StepLabel>
                <StepContent>
                  <Typography>{step.description}</Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </div>
      </div>
    </div>
  );
};

export default ProgressSteps;
