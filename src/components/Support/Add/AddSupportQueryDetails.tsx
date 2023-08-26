import { categoriesType } from "@/types/supportTypes";
import { MenuItem, Select, TextField, TextareaAutosize, Typography } from "@mui/material"
import React, { useState } from "react";

const AddSupportQueryDetails = ({
    query,
    categories,
    description,
    setQuery,
    setCategories,
    setDescription
}: {
    query: string,
        categories: Array<string> | undefined,
    description: string,
    setQuery: React.Dispatch<React.SetStateAction<string>>,
        setCategories: React.Dispatch<React.SetStateAction<Array<string> | undefined>>,
    setDescription: React.Dispatch<React.SetStateAction<string>>
}) => {

    const [categoriesList, setCategoriesList] = useState<Array<categoriesType>>([
        { label: 'Harvesting', value: 'harvesting' },
        { label: 'Irrigation', value: 'irrigation' },
    ]);

    return (
        <div style={{ display: "flex", flexDirection: "column", width: "50%", justifyContent: "center" }}>
            <div>
                <Typography variant='subtitle2'>Type Youe Query</Typography>
                <TextField
                    value={query}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                />
            </div>
            <div>
                <Typography variant='subtitle2'>Category</Typography>
                <Select
                    sx={{ minWidth: "200px" }}
                    value={categories}
                    onChange={(e: any) => setCategories(e.target.value)}
                    multiple
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