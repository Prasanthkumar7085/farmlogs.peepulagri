import styles from "./progress-steps.module.css";
import * as React from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Typography from '@mui/material/Typography';
import { useState } from "react";

const ProgressSteps = ({ activeStepBasedOnData }: { activeStepBasedOnData: number }) => {

  const steps = [
    {
      label: 'Work Type',
      description: `Choose type : Machinery & Manual or both`,
    },
    {
      label: 'Resources',
      description:
        'Add machinery like Tractors, Weed remover or man power',
    },
    {
      label: 'Additional Information (Optional)',
      description: `You can add additional details based on the category and work type`,
    },
    {
      label: 'Attachments',
      description:
        'Attach images videos and documents related to the logs',
    },
  ];

  const [activeStep, setActiveStep] = useState(activeStepBasedOnData);
  React.useEffect(() => {
    setActiveStep(activeStepBasedOnData)
  }, [activeStepBasedOnData])

  return (
    <div className={styles.progressSteps}>
      <div className={styles.card}>
        <div className={styles.progressStepsProgressIcon}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={index}>
                <StepLabel>
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









{/* <div className={styles.stepBase}>
            <div className={styles.connectorWrap}>
              <img
                className={styles.stepIconBase}
                alt=""
                src="/-step-icon-base.svg"
              />
              <div className={styles.connector} />
            </div>
            <div className={styles.textAndSupportingText}>
              <div className={styles.text}>Work Type</div>
              <div
                className={styles.supportingText}
              >{`Choose type : Machinery & Manual or both`}</div>
            </div>
          </div>
          <div className={styles.stepBase1}>
            <div className={styles.connectorWrap}>
              <img
                className={styles.stepIconBase1}
                alt=""
                src="/-step-icon-base1.svg"
              />
              <div className={styles.connector} />
            </div>
            <div className={styles.textAndSupportingText}>
              <div className={styles.text}>Resources</div>
              <div
                className={styles.supportingText}
              >{`Add machinery like Tractors, Weed remover  or man power `}</div>
            </div>
          </div>
          <div className={styles.stepBase}>
            <div className={styles.connectorWrap}>
              <img
                className={styles.stepIconBase1}
                alt=""
                src="/-step-icon-base1.svg"
              />
              <div className={styles.connector} />
            </div>
            <div className={styles.textAndSupportingText}>
              <div className={styles.text}>
                <span>{`Additional Information `}</span>
                <span className={styles.optional}>(Optional)</span>
              </div>
              <div
                className={styles.supportingText}
              >{`You can add additional details based on the category and work type `}</div>
            </div>
          </div>
          <div className={styles.stepBase1}>
            <div className={styles.connectorWrap}>
              <img
                className={styles.stepIconBase1}
                alt=""
                src="/-step-icon-base1.svg"
              />
              <div className={styles.connector3} />
            </div>
            <div className={styles.textAndSupportingText3}>
              <div className={styles.text}>Attachments</div>
              <div className={styles.supportingText3}>
                Attach images videos and documents related to the logs
              </div>
            </div>
          </div> */}