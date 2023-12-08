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

import styles from "../add/materials-required.module.css";
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
      <div style={{ width: "300px", padding: ".5rem 1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>Edit Material</h3>
          <IconButton
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
        <div className={styles.inputField}>
          <label className={styles.label}>
            Material Name <b style={{ color: "red" }}>*</b>
          </label>
          <TextField
            className={styles.input}
            color="primary"
            placeholder="Please enter the material title"
            variant="outlined"
            value={editNameValue}
            onChange={(e) => setEditNameValue(e.target.value)}
          />
          <ErrorMessages errorMessages={editErrorMessages} keyname={"name"} />
        </div>
        <div>
          <label className={styles.label}>
            Material Procurement (Qty){" "}
            <strong style={{ color: "red" }}>*</strong>
          </label>
          <TextField
            sx={{ width: "100%" }}
            type="number"
            value={editRequiredQty}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEditRequiredQty(e.target.value)
            }
            placeholder="Enter Procurement Quantity"
            InputProps={{
              endAdornment: (
                <Select
                  color="primary"
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

        <div className={styles.personofcontact}>
          <label className={styles.label}>
            Material Available (Qty)(optional)
          </label>
          <div className={styles.input1}>
            <TextField
              className={styles.inputbox}
              color="primary"
              placeholder="Enter Availble Quantity"
              variant="outlined"
              type="number"
              value={editAvailableQty}
              onChange={(e: any) => setEditAvailableQty(e.target.value)}
              InputProps={{
                endAdornment: (
                  <Select
                    color="primary"
                    value={editAvailableUnits}
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
        </div>
        <div className={styles.modalActions}>
          <div className={styles.buttonsgroup}>
            <Button
              color="primary"
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
              color="primary"
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
      </div>
    </Drawer>
  );
};

export default EditMaterialDrawer;
