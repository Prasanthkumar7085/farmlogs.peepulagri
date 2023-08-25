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

const AdditionalInformation = ({ setAdditionalResources }: any) => {

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

  const onChangeQuantity = (e: ChangeEvent<HTMLInputElement>) => {

    const newValue = e.target.value;
    const regex = /^\d+(\.\d{0,2})?$/;

    if (regex.test(newValue) || newValue === '') {
      setResourceQuantity(newValue);
    }

  }

  const editInResources = (newValue: string, index: number, item: string) => {
    let tempResources = [...resources];
    let itemObj = tempResources[index];
    itemObj = { ...itemObj, [item]: newValue }
    tempResources[index] = itemObj;
    setResources(tempResources);
    setAdditionalResources(tempResources)
  }

  const editInResourceType = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    editInResources(e.target.value, index, 'title')
  }
  const editInQuantity = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.target.value;
    const regex = /^\d+(\.\d{0,2})?$/;
    if (regex.test(newValue) || newValue === '') {
      editInResources(newValue, index, 'quantity')
    }
  }


  const editInResourceTitle = (e: any, index: number) => {
    editInResources(e.target.value, index, 'units')

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
            placeholder="Enter Quantity"
            size="small"
            margin="none"
            value={resourceQuantity}
            onChange={onChangeQuantity}
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
                    <TableCell>
                      <TextField
                        defaultValue={item.title}
                        value={item.title}
                        className={styles.textInput}
                        color="primary"
                        variant="outlined"
                        placeholder="Other Resources"
                        size="small"
                        margin="none"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => editInResourceType(e, index)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        defaultValue={item.quantity}
                        value={item.quantity}
                        className={styles.textInput}
                        sx={{ width: 122 }}
                        color="primary"
                        variant="outlined"
                        placeholder="Enter hrs"
                        size="small"
                        margin="none"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => editInQuantity(e, index)}
                      />
                    </TableCell>
                    <TableCell>{item.units}

                      <FormControl className={styles.dropdown} variant="outlined">
                        <InputLabel color="primary" />
                        <Select
                          color="primary"
                          name="Units"
                          size="small"
                          value={item.units}
                          onChange={(e: any) => editInResourceTitle(e, index)}
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
                    </TableCell>
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
