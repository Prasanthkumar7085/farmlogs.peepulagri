import { categoriesType } from "@/types/supportTypes";
import { MenuItem, Select, TextField, TextareaAutosize, Typography } from "@mui/material"
import React, { useState } from "react";
import getSupportByIdService from "../../../../lib/services/SupportService/getSupportByIdService";
import { useRouter } from "next/router";

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


    const [categoriesList] = useState<Array<categoriesType>>([
        { label: 'Harvesting', value: 'Harvesting' },
        { label: 'Irrigation', value: 'Irrigation' },
    ]);






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
                    sx={{ minWidth: "200px" }}
                    multiple
                    value={categories ? categories : []}
                    onChange={(e: any) => setCategories(e.target.value)}
                >
                    {categoriesList.map((item: categoriesType, index: number) => {
                        return (
                            <MenuItem key={index} value={item.value}>{item.label}</MenuItem>
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