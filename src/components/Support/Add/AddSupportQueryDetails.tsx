import { MenuItem, Select, TextField, TextareaAutosize, Typography } from "@mui/material"
import React, { useEffect, useState } from "react";
import getAllCategoriesService from "../../../../lib/services/Categories/getAllCategoriesService";
import { CategoriesType } from "@/types/categoryTypes";
import styles from "./AddSupportQueryDetails.module.css"

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



    const [categoriesList, setCategoriesList] = useState<Array<CategoriesType>>([]);


    const getAllCategories = async () => {
        const response = await getAllCategoriesService();
        if (response?.success) {
            setCategoriesList(response?.data);

        }

    }

    useEffect(() => {
        getAllCategories();
    }, [])

    return (
        <div className="form-fields">
            <div>
                <Typography variant='subtitle2' style={{fontFamily: "Inter", fontWeight: "600", color: "var(--gray-700)", marginBottom: '4px'}}>Type Youe Query</Typography>
                <TextField
                    style = {{width: "100%", marginBlockEnd: "1rem", backgroundColor: "#ffffff"}}
                    size="small"
                    placeholder="Enter your query"
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
                    placeholder="Select"
                    multiple
                    value={categories ? categories : []}
                    onChange={(e: any) => setCategories(e.target.value)}

                >
                    {categoriesList.map((item: Partial<CategoriesType>, index: number) => {
                        return (
                            <MenuItem key={index} value={item.slug}>{item.category}</MenuItem>
                        )
                    })}
                </Select>
            </div>
            <div>
                <Typography variant='subtitle2' style={{fontFamily: "Inter", fontWeight: "600", color: "var(--gray-700)", marginBottom: '4px'}}>Description</Typography>
                <TextareaAutosize
                    className={styles.textAreaLg}
                    value={description}
                    placeholder="Description"
                    minRows={4}
                    onChange={(e: any) => setDescription(e.target.value)}
                ></TextareaAutosize>
            </div>
        </div>
    )
}
export default AddSupportQueryDetails;