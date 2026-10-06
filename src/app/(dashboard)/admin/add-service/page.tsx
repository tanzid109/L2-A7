import { Suspense } from "react";
import AddServiceForm from "@/components/form/admin/add-service-form";
import { Spinner } from "@/components/ui/spinner";

const AddService = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <AddServiceForm />
    </Suspense>
  );
};

export default AddService;
