import Button from "@mui/material/Button";

const ButtonComponent = ({ direction = true, title, icon, ...rest }: any) => {

    return (
        <Button {...rest} sx={{ height: "40px", display: "flex", flexDirection: direction ? 'row' : 'row-reverse', alignItems: 'center' }}>
            {title}
            {icon}
        </Button>
    )
}
export default ButtonComponent;
