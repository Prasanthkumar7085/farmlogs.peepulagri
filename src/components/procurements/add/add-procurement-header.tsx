import type { NextPage } from "next";
import { useCallback, useState } from "react";
import { Button, Icon } from "@mui/material";
import styles from "./add-procurement-header.module.css";
import { useRouter } from "next/router";
import AlertDelete from "@/components/Core/DeleteAlert/alert-delete";
import { toast } from "sonner";
import deleteAddProcurementService from "../../../../lib/services/ProcurementServices/deleteAddProcurementService";
import { useSelector } from "react-redux";

const AddProcurementHeader = ({ data, afterProcurement, setAfterProcurement }: any) => {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const deleteProcurementApi = async () => {
    try {
      const response = await deleteAddProcurementService({
        procurementId: router.query.procurement_id,
        token: accessToken,
      });
      if (response?.status == 200 || response?.status == 201) {
        toast.success(response?.message);
        router.push("/procurements");
      } else if (response?.status == 401) {
        toast.error(response?.message);
      } else {
        toast.error("Something went wrong");
        throw response;
      }

      setDeleteLoading(true);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const onBackButtonClick = useCallback(() => {

    setAfterProcurement(false)
    if (router.pathname.includes("/edit") && router.query.material) {
      router.push(
        `/procurements/${data?._id || router.query.procurement_id}/edit`
      );
    } else if (router.pathname.includes("/add") && router.query.material) {
      router.push(
        `/procurements/add?procurement_id=${data?._id || router.query.procurement_id}`
      );
    }
    else {

      router.push("/procurements");

    }

  }, []);

  return (
    <div className={styles.addprocurementheader}>
      <Button
        className={styles.backbutton}
        color="primary"
        variant="contained"
        onClick={onBackButtonClick}
      >
        <img src="/arrow-left-back-white-black.svg" alt="" width={"18px"} />
      </Button>
      <div className={styles.textwrapper}>
        {afterProcurement ? "" : <p className={styles.backText}>Back To List</p>}
        <h2 className={styles.largetext}>{router.query.procurement_id ? "Edit Procurement" : "Add Procurement"}</h2>
      </div>
      <AlertDelete
        open={deleteOpen}
        deleteFarm={deleteProcurementApi}
        setDialogOpen={setDeleteOpen}
        loading={deleteLoading}
        deleteTitleProp={"Procurement"}
      />

    </div>
  );
};

export default AddProcurementHeader;
