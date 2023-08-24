import type { NextPage } from "next";
import {
  Button,
  Icon,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  Select,
} from "@mui/material";
import styles from "./additional-information.module.css";
import { ChangeEvent, useEffect, useState } from "react";

import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const AdditionalInformation = ({ register, setAdditionalResources }: any) => {

  const [resources, setResources] = useState<any>([]);

  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceQuantity, setResourceQuantity] = useState('');
  const [resourceUnits, setResourceUnits] = useState('');

  const units = [
    'Kilogram',
    'Gram',
    'Milligram',
    'Pound',
    'Ton',
    'Milliliter',
    'Liter',
    'Cup',
    'Pint',
    'Quart',
    'Liquid Gallon',
  ]


  const addResources = () => {
    let obj = { title: resourceTitle, quantity: resourceQuantity, units: resourceUnits, type: "Pesticides" };

      setResources([...resources, obj]);
      setAdditionalResources([...resources, obj]);
      setResourceTitle('')
      setResourceQuantity('')
    setResourceUnits('')
  }

  const removeFromAdditionalResources = (index: number) => {
    let filteredArray = [...resources];
    filteredArray.splice(index, 1);
    setResources(filteredArray);
    setAdditionalResources(filteredArray);

  }



  return (
    <div className={styles.additionalInformation}>
      <div className={styles.header}>
        <div className={styles.textwrapper}>
          <h4 className={styles.title}>Additional Information</h4>
          <p
            className={styles.description}
          >{`You can add additional details based on the category and work type `}</p>
        </div>
        <Button
          variant="contained"
          color="success"
          startIcon={<Icon>arrow_forward_sharp</Icon>}
          disabled={!resourceTitle || !resourceQuantity || !resourceUnits}
          onClick={addResources}
        >
          Add
        </Button>
      </div>
      <div className={styles.container}>
        <div className={styles.pesticide}>
          <div className={styles.label}>Pesticide</div>
          <TextField
            className={styles.textInput}
            fullWidth
            color="primary"
            variant="outlined"
            type="text"
            placeholder="Enter the name"
            size="small"
            margin="none"
            value={resourceTitle}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setResourceTitle(e.target.value)}
          />
        </div>
        <div className={styles.quantity}>
          <div className={styles.inputWithLabel}>
            <p className={styles.label1}>Quantity</p>
          </div>
          <TextField
            className={styles.textInput}
            sx={{ width: 122 }}
            color="primary"
            variant="outlined"
            defaultValue="0"
            type="number"
            placeholder="Enter Quantity"
            size="small"
            margin="none"
            value={resourceQuantity}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setResourceQuantity(e.target.value)}
          />
        </div>
        <div className={styles.units}>
          <p className={styles.label1}>Units</p>
          <FormControl className={styles.dropdown} variant="outlined">
            <InputLabel color="primary" />
            <Select
              color="primary"
              name="Units"
              size="small"
              value={resourceUnits}
              onChange={(e: any) => setResourceUnits(e.target.value)}
            >
              <MenuItem value=''><em>Select Units</em></MenuItem>
              {units.map((item: string, index: number) => {
                return (
                  <MenuItem key={index} value={item}>{item}</MenuItem>
                )
              })}

            </Select>
            <FormHelperText />
          </FormControl>
        </div>
      </div>

      {resources.length ?
        <div className={styles.table}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Resouces Type</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Units</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resources.map((item: any, index: number) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.units}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => removeFromAdditionalResources(index)}>
                        <DeleteOutlineIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div> : ""}

    </div>
  );
};

export default AdditionalInformation;
