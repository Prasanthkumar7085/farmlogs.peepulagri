import ErrorMessages from "@/components/Core/ErrorMessages";
import { Clear } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { ChangeEvent, Dispatch, FC, SetStateAction } from "react";

import styles from "./addMaterial.module.css";
import { NextPage } from "next";

interface pageProps {
  editMaterialOpen: boolean;
  setEditMaterialOpen: Dispatch<SetStateAction<boolean>>;
  editAvailableQty: number | null | string;
  setEditAvailableQty: Dispatch<SetStateAction<number | null | string>>;
  editAvailableUnits: string;
  setEditAvailableUnits: Dispatch<SetStateAction<string>>;
  editRequiredQty: number | null | string;
  setEditRequiredQty: Dispatch<SetStateAction<number | null | string>>;
  editRequiredUnits: string;
  setEditRequiredUnits: Dispatch<SetStateAction<string>>;
  editNameValue: string;
  setEditNameValue: Dispatch<SetStateAction<string>>;
  editErrorMessages: any;
  setEditErrorMessages: Dispatch<SetStateAction<any>>;
  updateMaterialById: () => void;
  updateLoading: boolean;
}
const EditMaterialDrawer: FC<pageProps> = ({
  editMaterialOpen,
  setEditMaterialOpen,
  editAvailableQty,
  setEditAvailableQty,
  editAvailableUnits,
  setEditAvailableUnits,
  editRequiredQty,
  setEditRequiredQty,
  editRequiredUnits,
  setEditRequiredUnits,
  editNameValue,
  setEditNameValue,
  editErrorMessages,
  setEditErrorMessages,
  updateMaterialById,
  updateLoading,
}) => {
  return (
    <Drawer anchor={"right"} open={editMaterialOpen}>
      <div className={styles.drawerBlock} >
        <div className={styles.drawerHeadingBlock}>
          <h3 className={styles.drawerHeading}>Edit Material</h3>
          <IconButton sx={{ padding: "0" }}
            onClick={() => {
              setEditAvailableQty(null);
              setEditAvailableUnits("");
              setEditRequiredQty(null);
              setEditRequiredUnits("");
              setEditNameValue("");
              setEditErrorMessages({});
              setEditMaterialOpen(false);
            }}
          >
            <Clear />
          </IconButton>
        </div>
        <div className={styles.eachInputField}>
          <label className={styles.inputLabel}>
            Material Name <b style={{ color: "red" }}>*</b>
          </label>
          <TextField
            sx={{
              background: "#fff",
              width: "100%",
              '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: "8px 8px !important"
              },
              '& .MuiInputBase-input': {
                fontSize: "clamp(12px, 0.72vw, 14px)",
                fontFamily: "'Inter', sans-serif"
              }
            }}
            size="small"
            placeholder="Please enter the material title"
            variant="outlined"
            value={editNameValue}
            onChange={(e) => setEditNameValue(e.target.value)}
          />
          <ErrorMessages errorMessages={editErrorMessages} keyname={"name"} />
        </div>
        <div className={styles.eachInputField}>
          <label className={styles.inputLabel}>
            Material Procurement (Qty){" "}
            <strong style={{ color: "red" }}>*</strong>
          </label>
          <TextField
            size="small"
            sx={{
              width: "100%", background: "#fff",
              '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: "8px 8px !important"
              },
              '& .MuiInputBase-input': {
                fontSize: "clamp(12px, 0.72vw, 14px)",
                fontFamily: "'Inter', sans-serif"
              }
            }}
            type="number"
            value={editRequiredQty}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEditRequiredQty(e.target.value)
            }
            placeholder="Enter Procurement Quantity"
            InputProps={{
              endAdornment: (
                <Select
                  sx={{
                    background: "#fff",
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderWidth: "0 !important",
                      borderRadius: "0 8px 8px 0 !important"
                    }
                  }}
                  value={editRequiredUnits}
                  onChange={(e: any) => setEditRequiredUnits(e.target.value)}
                >
                  <MenuItem value="Litres">Litres</MenuItem>
                  <MenuItem value="Kilograms">Kilograms</MenuItem>
                </Select>
              ),
            }}
          />
          <ErrorMessages
            errorMessages={editErrorMessages}
            keyname={"required_qty"}
          />
        </div>

        <div className={styles.eachInputField}>
          <label className={styles.inputLabel}>
            Material Available (Qty)(optional)
          </label>
          <TextField
            size="small"
            sx={{
              width: "100%", background: "#fff",
              '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: "8px 8px !important"
              },
              '& .MuiInputBase-input': {
                fontSize: "clamp(12px, 0.72vw, 14px)",
                fontFamily: "'Inter', sans-serif"
              }
            }} placeholder="Enter Availble Quantity"
            variant="outlined"
            type="number"
            value={editAvailableQty}
            onChange={(e: any) => setEditAvailableQty(e.target.value)}
            InputProps={{
              endAdornment: (
                <Select
                  sx={{
                    background: "#fff",
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderWidth: "0  !important",
                      borderRadius: "0 8px 8px 0 !important"
                    }
                  }} value={editAvailableUnits}
                  onChange={(e: any) => setEditAvailableUnits(e.target.value)}
                >
                  <MenuItem value="Litres">Litres</MenuItem>
                  <MenuItem value="Kilograms">Kilograms</MenuItem>
                </Select>
              ),
            }}
          />
          <ErrorMessages
            errorMessages={editErrorMessages}
            keyname={"required_units"}
          />
        </div>
        <div className={styles.procurementFormBtn}>
          <Button
            className={styles.cancelBtn}
            variant="outlined"
            onClick={() => {
              setEditAvailableQty(null);
              setEditAvailableUnits("");
              setEditRequiredQty(null);
              setEditRequiredUnits("");
              setEditNameValue("");
              setEditErrorMessages({});
              setEditMaterialOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            className={styles.submitBtn}

            variant="contained"
            onClick={() => updateMaterialById()}
          >
            {updateLoading ? (
              <CircularProgress size="1.5rem" sx={{ color: "white" }} />
            ) : (
              "Update"
            )}
          </Button>
        </div>

      </div>
    </Drawer>
  );
};

export default EditMaterialDrawer;
