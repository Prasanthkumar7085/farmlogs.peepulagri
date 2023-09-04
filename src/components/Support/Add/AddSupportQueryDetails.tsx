import { categoriesType } from "@/types/supportTypes";
import { MenuItem, Select, TextField, TextareaAutosize, Typography } from "@mui/material"
import React from "react";

const AddSupportQueryDetails = ({
    query,
    categories,
    description,
    setQuery,
    setCategories,
    setDescription }: {
        query: string,
        categories: Array<string> | undefined,
        description: string,
        setQuery: React.Dispatch<React.SetStateAction<string>>,
        setCategories: React.Dispatch<React.SetStateAction<Array<string> | undefined>>,
        setDescription: React.Dispatch<React.SetStateAction<string>>

    }) => {



    const categoriesList: Array<Partial<categoriesType>> = [
        { title: 'Input Resources', value: "input_resources" },
        { title: 'Irrigation', value: "irrigation" },
        { title: 'Tools', value: "tools" },
        { title: 'Harvesting', value: "harvesting" },
        { title: 'Alerts', value: "alerts" },
        { title: 'Notifications', value: "notifications" },
        { title: 'Climate & Weather', value: "climate_and_weather" },
        { title: 'Dashboard', value: "dashboard" },
        { title: 'New Features', value: "new_features" },
        { title: 'Data Analysis', value: "data_analysis" },
        { title: 'Bug & Trouble Shooting', value: "bug_and_touble_shooting" },
    ];

    return (
        <div className="form-fields">
            <div>
                <Typography variant='subtitle2' style={{fontFamily: "Inter", fontWeight: "600", color: "var(--gray-700)", marginBottom: '4px'}}>Type Youe Query</Typography>
                <TextField
                    style = {{width: "100%", marginBlockEnd: "1rem", backgroundColor: "#ffffff"}}
                    size="small"
                    value={query}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setQuery(e.target.value)
                    }}
                />
            </div>
            <div>
                <Typography variant='subtitle2' style={{fontFamily: "Inter", fontWeight: "600", color: "var(--gray-700)", marginBottom: '4px'}}>Category</Typography>
                <Select
                    style = {{ width: "100%", marginBlockEnd: "1rem", backgroundColor: "#ffffff" }}
                    size="small"
                    multiple
                    value={categories ? categories : []}
                    onChange={(e: any) => setCategories(e.target.value)}

                >
                    {categoriesList.map((item: Partial<categoriesType>, index: number) => {
                        return (
                            <MenuItem key={index} value={item.value}>{item.title}</MenuItem>
                        )
                    })}
                </Select>
            </div>
            <div>
                <Typography variant='subtitle2' style={{fontFamily: "Inter", fontWeight: "600", color: "var(--gray-700)", marginBottom: '4px'}}>Description</Typography>
                <TextareaAutosize
                    style = {{width: "100%", marginBlockEnd: "1rem"}}
                    value={description}
                    minRows={4}
                    onChange={(e: any) => setDescription(e.target.value)}
                ></TextareaAutosize>
            </div>
        </div>
    )
}
export default AddSupportQueryDetails;