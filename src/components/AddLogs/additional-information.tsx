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
import ButtonComponent from "../Core/ButtonComponent";
import styles from "./additional-information.module.css";
import { ChangeEvent, useEffect, useState } from "react";

import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ErrorMessagesComponent from "../Core/ErrorMessagesComponent";

const AdditionalInformation = ({ errorMessages, setAdditionalResources, singleLogDetails, setActiveStepBasedOnData }: any) => {

  const [resources, setResources] = useState<any>(singleLogDetails?.additional_resources ? singleLogDetails?.additional_resources : []);

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
    let obj = { title: resourceTitle, quantity: resourceQuantity ? +resourceQuantity : null, units: resourceUnits, type: "Pesticides" };

    setResources([...resources, obj]);
    setAdditionalResources([...resources, obj]);

    setActiveStepBasedOnData(3);

    setResourceTitle('')
    setResourceQuantity('')
    setResourceUnits('')
  }

  const removeFromAdditionalResources = (index: number) => {
    let filteredArray = [...resources];
    filteredArray.splice(index, 1);
    setResources(filteredArray);
    setAdditionalResources(filteredArray);

    if (!filteredArray.length) {
      setActiveStepBasedOnData(2);
    }

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
    itemObj = { ...itemObj, [item]: newValue ? +newValue : null }
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

    let newValue = e.target.value;
    let tempResources = [...resources];
    let itemObj = tempResources[index];
    itemObj = { ...itemObj, units: newValue ? newValue : '' }
    tempResources[index] = itemObj;
    setResources(tempResources);
    setAdditionalResources(tempResources)

  }

  const getErrorString = (index: number, value: string) => {
    if (errorMessages && Object.keys(errorMessages).length) {
      let tempString: any = `additional_resources.${index}.${value}`;
      return errorMessages[tempString];
    }
  }
  return (
    <div className={styles.additionalInformation}>
      <div className={styles.header}>
        <div className={styles.textwrapper}>
          <h4 className={styles.title}>Additional Resources</h4>
          <p
            className={styles.description}
          >{`You can add additional details based on the category and work type `}</p>
        </div>

        <ButtonComponent
            title={'Add'}
            direction={true}
            variant="contained"
            color="success"
            size="small"
            startIcon={<Icon>arrow_forward_shar</Icon>}
            disabled={!resourceTitle || !resourceQuantity || !resourceUnits}
            onClick={addResources}
          >
            Add
          </ButtonComponent>
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
                      <ErrorMessagesComponent errorMessage={getErrorString(index, 'title')} />
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
                      <ErrorMessagesComponent errorMessage={getErrorString(index, 'quantity')} />
                    </TableCell>
                    <TableCell>

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
                        <ErrorMessagesComponent errorMessage={getErrorString(index, 'units')} />
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
