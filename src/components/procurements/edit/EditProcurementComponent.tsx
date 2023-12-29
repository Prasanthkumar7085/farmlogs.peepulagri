import { useState } from "react";
import AddProcurementForm from "../add/add-procurement-form";
import AddProcurementHeader from "../add/add-procurement-header";
import MaterialsRequired from "../add/materials-required";
import POC from "./POC";

const EditProcurementComponent = () => {
  return (
    <div style={{ paddingBottom: "2rem" }}>
      <AddProcurementForm />
      <MaterialsRequired />
    </div>
  );
};
export default EditProcurementComponent;
