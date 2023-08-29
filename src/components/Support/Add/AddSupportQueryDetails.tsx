import { categoriesType } from "@/types/supportTypes";
import { MenuItem, Select, TextField, TextareaAutosize, Typography } from "@mui/material"
import React, { useState } from "react";

const AddSupportQueryDetails = ({
    query,
    categories,
    description,
    setQuery,
    setCategories,
    setDescription,
    supportOneDetails }: {
        query: string,
        categories: Array<string> | undefined,
        description: string,
        setQuery: React.Dispatch<React.SetStateAction<string>>,
        setCategories: React.Dispatch<React.SetStateAction<Array<string> | undefined>>,
        setDescription: React.Dispatch<React.SetStateAction<string>>
        supportOneDetails: any
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
        <div style={{ display: "flex", flexDirection: "column", width: "50%", justifyContent: "center" }}>
            <div>
                <Typography variant='subtitle2'>Type Youe Query</Typography>
                <TextField
                    value={query}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setQuery(e.target.value)
                    }}
                />
            </div>
            <div>
                <Typography variant='subtitle2'>Category</Typography>
                <Select
                    sx={{ minWidth: "200px", maxWidth: "200px" }}
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
                <Typography variant='subtitle2'>Description</Typography>
                <TextareaAutosize
                    value={description}
                    minRows={3}
                    onChange={(e: any) => setDescription(e.target.value)}
                ></TextareaAutosize>
            </div>
        </div>
    )
}
export default AddSupportQueryDetails;