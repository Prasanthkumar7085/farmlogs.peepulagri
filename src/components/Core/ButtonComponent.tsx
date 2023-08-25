import Button from "@mui/material/Button";

const ButtonComponent = ({ direction = true, title, icon, ...rest }: any) => {

    return (
        <Button {...rest} sx={{ height: "40px", display: "flex", flexDirection: direction ? 'row' : 'row-reverse', justifyContent: "space-evenly", alignItems: 'center' }}>
            <div>{title} </div>
            <div>{icon}</div>
        </Button>
    )
}
export default ButtonComponent;
