import AddProcurementForm from "../add/add-procurement-form";
import AddProcurementHeader from "../add/add-procurement-header";
import MaterialsRequired from "../add/materials-required";

const EditProcurementComponent = () => {
  return (
    <div>
      <AddProcurementHeader />
      <AddProcurementForm />
      <MaterialsRequired />
    </div>
  );
};
export default EditProcurementComponent;
