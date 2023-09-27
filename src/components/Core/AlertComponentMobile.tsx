import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { AlertComponentMobileType, AlertComponentType } from '@/types/coreComponentsTypes';

const AlertComponentMobile = ({ alertMessage, setAlertMessage, alertType,mobile }: AlertComponentMobileType) => {
    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar anchorOrigin={{ vertical: mobile?'bottom':'top', horizontal: 'right' }} open={Boolean(alertMessage)} autoHideDuration={3000} onClose={() => setAlertMessage('')}>
                <MuiAlert variant='filled' onClose={() => setAlertMessage('')} severity={`${alertType ? "success" : "error"}`} sx={{ width: '100%' }}>
                    {alertMessage}
                </MuiAlert>
            </Snackbar>
        </Stack>
    )
}

export default AlertComponentMobile;