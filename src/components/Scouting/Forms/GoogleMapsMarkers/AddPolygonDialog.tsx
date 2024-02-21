import { Button, Dialog, Drawer } from "@mui/material";
import styles from "./addPolygonDialog.module.css";
import Image from "next/image";
const AddPolygonDialog = ({ addPolygonOpen, setAddPolygonOpen }: any) => {
  return (
    <div>
      <Dialog
        open={Boolean(addPolygonOpen)}
        sx={{
          zIndex: "1300 !important",
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "500px",
            margin: "0 auto",
            borderRadius: "20px 20px 0 0 ",
            minHeight: "30%",
          },
        }}
      >
        <div className={styles.dialogDiv}>
          <div className={styles.contentDiv}>
            <Image
              src={"/Polygon _icon.svg"}
              width={100}
              height={100}
              alt="f"
            />
            <div className={styles.header}>
              Draw your field on map
              <p className={styles.subheading}>
                Simply use the polygon tool to outline your fields directly on
                the map.
              </p>
            </div>
          </div>
          <div className={styles.buttons}>Draw Feild</div>
        </div>
      </Dialog>
    </div>
  );
};
export default AddPolygonDialog;
