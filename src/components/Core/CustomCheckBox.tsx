import React, { useState } from "react";
import Checkbox from '@mui/material/Checkbox';

function CustomGalleryItem({ src, width, height, selected, onSelect }: any) {
    const [checked, setChecked] = useState(selected);

    const handleChange = () => {
        setChecked(!checked);
        onSelect(src, !checked); // Notify the parent component of the selection change
    };

    return (
        <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: 0, right: 0 }}>
                <Checkbox
                    checked={checked}
                    onChange={handleChange}
                    inputProps={{ "aria-label": "controlled" }}
                    color="secondary"
                />
            </div>
        </div>
    );
}

export default CustomGalleryItem;
