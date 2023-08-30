import Button from "@mui/material/Button";

const ButtonComponent = ({ direction = true, title, icon, ...rest }: any) => {

    return (
        <Button {...rest} sx={{ display: "flex", flexDirection: direction ? 'row' : 'row-reverse', alignItems: 'center' }}>
            {title}
            {icon}
        </Button>
    )
}
export default ButtonComponent;
