import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { AlertComponentType } from '@/types/coreComponentsTypes';

const AlertComponent = ({ alertMessage, setAlertMessage, alertType }: AlertComponentType | any) => {
    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar sx={{ boxShadow: "0px 0px 2px 1px #05a155" }} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={Boolean(alertMessage)} autoHideDuration={3000} onClose={() => setAlertMessage('')}>
                <MuiAlert variant='filled' onClose={() => setAlertMessage('')} severity={`${alertType ? "success" : "error"}`} sx={{ width: '100%', fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>
                    {alertMessage}
                </MuiAlert>
            </Snackbar>
        </Stack>
    )
}

export default AlertComponent;