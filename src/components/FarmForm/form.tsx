import type { NextPage } from "next";
import {
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  Select,
  TextField,
  Button,
  Card,
} from "@mui/material";
import styles from "./form.module.css";
import { DateRangePicker, Stack } from 'rsuite';
import "rsuite/dist/rsuite.css";
import Divider from '@mui/material/Divider';


const Form = () => {

  return (
    <Card style={{ marginTop: "100px", marginLeft: "40%", padding: "20px" }}>

      <section className={styles.form}>
        <div className={styles.cardworktype}>
          <div className={styles.conatiner}>
            <div className={styles.workType}>
              <p className={styles.label}>Work Type</p>
              <FormControl className={styles.dropdown} variant="outlined">
                <InputLabel color="primary" />
                <Select color="primary" defaultValue="Choose Type" size="small">
                  <MenuItem value="Select All">Select All</MenuItem>
                  <MenuItem value="Machinery">Machinery</MenuItem>
                  <MenuItem value="Manual">Manual</MenuItem>
                </Select>
                {/* <FormHelperText /> */}
              </FormControl>
            </div>

            <div className={styles.date}>
              <p className={styles.label}>Date</p>
              <div className={styles.dropdown}>

                <Stack direction="column" spacing={8} alignItems="flex-start">
                  <DateRangePicker
                    onChange={(newDate: any) => { }}
                    placeholder='Please Select the date'
                    format={'dd-MM-yyyy'} />
                </Stack>
              </div>
            </div>
          </div>
        </div>
        <Divider variant="middle" />
        <img className={styles.formChild} alt="" src="/line-5@2x.png" />

        <div className={styles.resource}>
          <div className={styles.container}>
            <div className={styles.header}>
              <div className={styles.textwrapper}>
                <h3 className={styles.title}>Resources</h3>
                <p className={styles.description}>
                  You can add multiple resources
                </p>
              </div>
              <Button
                variant="contained"
                color="success"
              >
                Add
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.resourcetypeParent}>
          <div className={styles.resourcetype}>
            <p className={styles.label}>Resources Type</p>
            <FormControl className={styles.dropdown} variant="outlined">
              <InputLabel color="primary" />
              <Select
                color="primary"
                defaultValue="Choose Type"
                size="small"
              >
                <em>Select Resourses Type</em>
                <MenuItem value="01">Cultivation Tools</MenuItem>
                <MenuItem value="02">Tractor</MenuItem>
                <MenuItem value="03">Irrigation Equipment</MenuItem>
                <MenuItem value="04">Men</MenuItem>
                <MenuItem value="05">Mulching Machines</MenuItem>
                <MenuItem value="05">Seeders and Planters</MenuItem>
              </Select>
              <FormHelperText />
            </FormControl>
          </div>
          <div>
            <p className={styles.label}>Quantity</p>
            <FormControl className={styles.dropdown} variant="outlined">
              <InputLabel color="primary" />
              <Select
                color="primary"
                defaultValue="Choose Type"
                size="small"
              >
                <MenuItem value="01">01</MenuItem>
                <MenuItem value="02">02</MenuItem>
                <MenuItem value="03">03</MenuItem>
                <MenuItem value="04">04</MenuItem>
                <MenuItem value="05">05</MenuItem>
              </Select>
              <FormHelperText />
            </FormControl>
          </div>
          <div className={styles.inputField}>
            <p className={styles.label}>Total Hours</p>
            <div className={styles.textInput}>
              <TextField
                className={styles.text}
                color="primary"
                variant="outlined"
                type="text"
                placeholder="Enter the name"
                size="small"
                margin="none"
                required
              />
            </div>
          </div>
        </div>
        <img className={styles.formChild} alt="" src="/line-5@2x.png" />
        <div className={styles.additionalInformation}>
          <div className={styles.header}>
            <div className={styles.textwrapper}>
              <h3 className={styles.title}>Additional Information</h3>
              <p
                className={styles.description}
              >{`You can add additional details based on the category and work type `}</p>
            </div>
            <Button
              variant="contained"
              color="success"

            >
              Add
            </Button>
          </div>
          <div className={styles.container1}>
            <div className={styles.pesticide}>
              <div className={styles.label5}>Pesticide</div>
              <div className={styles.textInput1}>
                <TextField
                  className={styles.text}
                  color="primary"
                  variant="outlined"
                  type="text"
                  placeholder="Enter the name of the Pesticide"
                  size="small"
                  margin="none"
                  required
                />
              </div>
            </div>
            <div className={styles.quantity1}>
              <div className={styles.inputWithLabel}>
                <p className={styles.label}>Quantity</p>
              </div>
              <FormControl className={styles.dropdown} variant="outlined">
                <InputLabel color="primary" />
                <Select color="primary" defaultValue="Choose Type" size="small">
                  <em>Select Quantity</em>
                  <MenuItem value="01">01</MenuItem>
                  <MenuItem value="02">02</MenuItem>
                  <MenuItem value="03">03</MenuItem>
                  <MenuItem value="04">04</MenuItem>
                  <MenuItem value="05">05</MenuItem>
                </Select>
                <FormHelperText />
              </FormControl>
            </div>
            <div className={styles.units}>
              <p className={styles.label}>Units</p>
              <FormControl className={styles.dropdown} variant="outlined">
                <InputLabel color="primary" />
                <Select color="primary" defaultValue="Choose Type" size="small">
                  <em>Units</em>
                  <MenuItem value="litre">Litre</MenuItem>
                  <MenuItem value="pounds">Pounds</MenuItem>
                  <MenuItem value="kilo_grams">Kilo Grams</MenuItem>
                  {/* <MenuItem value="04"></MenuItem>
                  <MenuItem value="05">05</MenuItem> */}
                </Select>
                <FormHelperText />
              </FormControl>
            </div>
          </div>
        </div>
        <img className={styles.formChild} alt="" src="/line-5@2x.png" />
        <div className={styles.attachments}>
          <div className={styles.header2}>
            <h3 className={styles.title}>Attachments</h3>
            <p className={styles.description}>
              You can also drag and drop files to upload them.
            </p>
          </div>
          <input className={styles.link} type="file" />
        </div>
      </section>

    </Card>
  );
};

export default Form;
