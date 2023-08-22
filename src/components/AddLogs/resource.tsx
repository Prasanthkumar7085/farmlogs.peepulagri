import type { NextPage } from "next";
import {
  Button,
  Icon,
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  Select,
  TextField,
} from "@mui/material";
import styles from "./resource.module.css";
import ButtonComponent from "../Core/ButtonComponent";
import { ChangeEvent, FormEvent, PointerEvent, useState } from "react";

import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';



const Resource = ({ register, setResources: setAllResources }: any) => {

  const [resources, setResources] = useState<any>([]);

  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceQuantity, setResourceQuantity] = useState('');
  const [resourceHours, setResourceHours] = useState('');

  const resourcesType = [
    'Tractor',
    'Sprayers',
    'Men',
    'Women',
  ]

  const addResources = () => {
    let obj = { title: resourceTitle, quantity: resourceQuantity, total_hours: resourceHours, type: "Manual" };
    let index = resources.findIndex((item: any) => item.title == obj.title);

    if (index == -1) {
      setResources([...resources, obj]);
      setAllResources([...resources, obj])
      setResourceTitle('')
      setResourceQuantity('')
      setResourceHours('')
    }
  }

  const removeFromResources = (index: number) => {
    let filteredArray = [...resources];
    filteredArray.splice(index, 1);
    setResources(filteredArray);
    setAllResources(filteredArray)
  }

  return (
    <div className={styles.resource}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.textwrapper}>
            <h4 className={styles.title}>Resources</h4>
            <p className={styles.description}>You can add multiple resources</p>
          </div>
          <ButtonComponent
            disabled={!resourceTitle || !resourceQuantity || !resourceHours}
            title={'Add'}
            direction={true}
            variant="contained"
            color="success"
            startIcon={<Icon>arrow_forward_shar</Icon>}
            onClick={addResources}
          >
            Add
          </ButtonComponent>
        </div>
        <div className={styles.resourcetypeParent}>
          <div className={styles.resourcetype}>
            <p className={styles.label}>Resources Type</p>
            <FormControl className={styles.dropdown} variant="outlined">
              <InputLabel color="primary" />
              <Select
                color="primary"
                size="small"
                value={resourceTitle}
                onChange={(e: any) => setResourceTitle(e.target.value)}
              >
                {resourcesType.map((item: any, index: number) => {
                  return (
                    <MenuItem key={index} value={item} disabled={resources.some((obj: any) => obj.title === item)}>{item}</MenuItem>
                  )
                })}

              </Select>
              <FormHelperText />
            </FormControl>
          </div>
          <div className={styles.quantity}>
            <p className={styles.label}>Quantity</p>

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
          <div className={styles.inputField}>
            <p className={styles.label}>Total Hours</p>
            <TextField
              className={styles.textInput}
              sx={{ width: 122 }}
              color="primary"
              variant="outlined"
              defaultValue="0"
              type="number"
              placeholder="Enter hrs"
              size="small"
              margin="none"
              value={resourceHours}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setResourceHours(e.target.value)}
            />
          </div>
        </div>
      </div>
      {resources.length ?
        <div className={styles.table}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Resouces Type</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total Hours</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resources.map((item: any, index: number) => {
              return (
                <TableRow key={index}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.total_hours}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => removeFromResources(index)}>
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

export default Resource;
