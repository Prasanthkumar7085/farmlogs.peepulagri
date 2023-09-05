import AddSupportForm from "./AddSupportForm";
import AddSupportHeader from "./AddSupportHeader";

const AddSupportPage = () => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: "1000px",
            minHeight: "100vh",
            margin: "0 auto",
        }}>
            <AddSupportHeader />
            <AddSupportForm />
        </div>
    )
}

export default AddSupportPage;