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
import { ChangeEvent, FormEvent, PointerEvent, useEffect, useState } from "react";

import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { ResourcesType } from "@/types/logsTypes";


const Resource = ({ setResources: setAllResources }: any) => {

  const [resources, setResources] = useState<Array<ResourcesType>>([]);

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
    let obj = { title: resourceTitle, quantity: resourceQuantity, total_hours: resourceHours, type: (resourceTitle == 'Men' || resourceTitle == "Women") ? "Manual" : "Machinary" };

    setResources([...resources, obj]);
    setAllResources([...resources, obj]);

    setResourceTitle('')
    setResourceQuantity('')
    setResourceHours('')

  }

  const removeFromResources = (index: number) => {
    let array = [...resources];
    let filteredArray = array.filter((item: any, itemIndex: number) => index != itemIndex);
    setResources(filteredArray);
    setAllResources(filteredArray);
  }

  const onChangeQuantity = (e: ChangeEvent<HTMLInputElement>) => {

    const newValue = e.target.value;
    const regex = /^\d+(\d{0,2})?$/;

    if (regex.test(newValue) || newValue === '') {
      setResourceQuantity(newValue);
    }

  }

  const onChangeHrs = (e: ChangeEvent<HTMLInputElement>) => {

    const newValue = e.target.value;
    const regex = /^\d+(\.\d{0,2})?$/;

    if (regex.test(newValue) || newValue === '') {
      setResourceHours(newValue);
    }
  }

  const editInResources = (newValue: string, index: number, item: string) => {
    let tempResources = [...resources];
    let itemObj = tempResources[index];
    itemObj = { ...itemObj, [item]: newValue }
    tempResources[index] = itemObj;
    setResources(tempResources);
    setAllResources(tempResources)

  }
  const editInQuantity = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.target.value;
    const regex = /^\d+(\.\d{0,2})?$/;
    if (regex.test(newValue) || newValue === '') {
      editInResources(newValue, index, 'quantity')
    }
  }

  const editInHours = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.target.value;
    const regex = /^\d+(\.\d{0,2})?$/;

    if (regex.test(newValue) || newValue === '') {
      editInResources(newValue, index, 'total_hours')
    }
  }
  useEffect(() => {
    setResources(resources)
  }, [resources])

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
                    <MenuItem key={index} value={item}>{item}</MenuItem>
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
              placeholder="Enter Quantity"
              size="small"
              margin="none"
              value={resourceQuantity}
              onChange={onChangeQuantity}
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
              placeholder="Enter Hours"
              size="small"
              margin="none"
              value={resourceHours}
              onChange={onChangeHrs}
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
                    <TableCell>
                      <TextField
                        defaultValue={item.total_hours}
                        value={item.total_hours}
                        className={styles.textInput}
                        sx={{ width: 122 }}
                        color="primary"
                        variant="outlined"
                        placeholder="Enter hrs"
                        size="small"
                        margin="none"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => editInHours(e, index)}
                      />
                    </TableCell>
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
