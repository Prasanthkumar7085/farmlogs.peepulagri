import { setFarmTitleTemp } from "@/Redux/Modules/Farms";
import { Autocomplete, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const SelectAutoCompleteForFarms = ({ options, value, onSelectValueFromDropDown, label, placeholder, defaultValue }: any) => {

    const [defaultValueSet, setDefaultValueSet] = useState<any>();
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        if (router.isReady && router.query.farm_id) {
            setDefaultValueSet(options && options.find((item: any) => item._id == router.query.farm_id))
        }

    }, [router.isReady, options, router.query]);

    return (
        <div>
            <Autocomplete
                value={defaultValueSet ? defaultValueSet : null}
                disablePortal
                size='small'
                id="combo-box-demo"
                options={(options && options?.length) ? options : []}
                disabled={router.pathname == "/farms/[farm_id]/crops/[crop_id]/scouting/[scout_id]/edit" ? true : false}
                getOptionLabel={(option: any) => option[label] ? option[label]?.toUpperCase() : ""}
                onChange={(e: any, value: any, reason: any) => {
                    if (value) {
                        onSelectValueFromDropDown(value, reason);
                        setDefaultValueSet(value);
                        dispatch(setFarmTitleTemp(value?.title));
                    }
                    else {
                        onSelectValueFromDropDown("", reason);
                        setDefaultValueSet(value)

                    }

                }}
                renderInput={(params) => <TextField {...params} placeholder={placeholder} />
                }
                sx={{
                    width: '100%',
                    background: "#fff",
                    "& .MuiInputBase-input ": {
                        fontSize: "13px",
                        fontWeight: "400",
                        fontFamily: "'inter', sans-serif ",
                        color: "#000",

                    }
                }}
            />

        </div>
    );
}

export default SelectAutoCompleteForFarms;