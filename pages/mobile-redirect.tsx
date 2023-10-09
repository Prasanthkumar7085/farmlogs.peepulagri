import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import { setToInitialState } from "@/Redux/Modules/Farms";
import { resetOtpCountDown } from "@/Redux/Modules/Otp";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const Redirect = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const onLogoutCMenuItemck = async () => {
    try {
      const responseUserType = await fetch("/api/remove-cookie");
      if (responseUserType) {
        const responseLogin = await fetch("/api/remove-cookie");
        if (responseLogin.status) {
          router.push("/");
        } else throw responseLogin;
      }
      await dispatch(removeUserDetails());
      await dispatch(deleteAllMessages());
      await dispatch(resetOtpCountDown());
      await dispatch(setToInitialState());
    } catch (err: any) {
      console.error(err);
    }
  };

  const autoLogout = async () => {
    await onLogoutCMenuItemck();
  };

  useEffect(() => {
    setTimeout(() => {
      autoLogout();
    }, 10000);
  }, []);

  return (
    <div style={{ padding: "10% 6% 10% 6%" }}>
      <div
        style={{
          textAlign: "center",
          border: "3px dashed #a05148",
          borderRadius: "10px",
          padding: "10px",
        }}
      >
        <p style={{ fontSize: "20px" }}>
          {"Looks like you don't access to this page for present!"}
        </p>
        <p style={{ color: "#a05148", fontSize: "17px", fontWeight: "bold" }}>
          {"Please login into a desktop"}
        </p>
      </div>
    </div>
  );
};

export default Redirect;
