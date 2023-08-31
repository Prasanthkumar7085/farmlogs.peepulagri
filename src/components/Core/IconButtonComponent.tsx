import IconButton from '@mui/material/IconButton';

const IconButtonComponent = ({ icon, ...rest }: any) => {

    return (
        <IconButton  {...rest}>
            {icon}
        </IconButton>
    )
}
export default IconButtonComponent;
