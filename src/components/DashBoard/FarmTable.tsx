import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const FarmTable = () => {

    const router = useRouter();

    const [farmId, setFarmId] = useState();

    useEffect(() => {
        setFarmId(router.query.farm_id);
    }, [router]);

    return (
        <div>
            {farmId}
        </div>
    )
}

export default FarmTable;