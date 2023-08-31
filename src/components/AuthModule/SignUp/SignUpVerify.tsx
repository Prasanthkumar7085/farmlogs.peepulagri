import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const SignUpVerify = () => {

    const router = useRouter();

    const [mobile, setMobile] = useState<string>();

    useEffect(() => {
        if (router?.isReady) {
            setMobile(router.query.mobile as string);
        }
    }, [router.isReady])

    return (
        <div>
            {mobile}
        </div>
    )
}


export default SignUpVerify;