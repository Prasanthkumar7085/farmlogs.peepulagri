import { setFarmTitleTemp } from "@/Redux/Modules/Farms";
import { Autocomplete, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const CropsDropDown = ({
    options,
    onSelectValueFromCropsDropDown,
    label,
    placeholder,
    searchString,
    getCropSearchString,
    optionsLoading,
    setOptionsLoading,
}: any) => {
    const [defaultValueSet, setDefaultValueSet] = useState<any>("");
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        if (router.isReady && !searchString) {
            setDefaultValueSet(
                options && options.find((item: any) => item._id == defaultValueSet)
            );
        }
    }, [router.isReady, options]);

    return (
        <div>
            <Autocomplete
                loading={optionsLoading}
                value={defaultValueSet ? defaultValueSet : null}
                size="small"
                id="combo-box-demo"
                options={options && options?.length ? options : []}
                getOptionLabel={(option: any) =>
                    option[label] ? option[label]?.toUpperCase() : ""
                }
                onChange={(e: any, value: any, reason: any) => {
                    if (value) {
                        onSelectValueFromCropsDropDown(value, reason);
                        setDefaultValueSet(value);
                        dispatch(setFarmTitleTemp(value?.title));
                    } else {
                        onSelectValueFromCropsDropDown("", reason);
                        setDefaultValueSet(null);
                    }
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder={placeholder}
                        onChange={(e) => {
                            // setOptionsLoading(true);
                            getCropSearchString(e.target.value);
                        }}
                    />
                )}
                sx={{
                    width: "100%",
                    background: "#fff",
                    "& .MuiInputBase-input ": {
                        fontSize: "13px",
                        fontWeight: "400",
                        fontFamily: "'inter', sans-serif ",
                        color: "#000",
                    },
                }}
            />
        </div>
    );
};

export default CropsDropDown;