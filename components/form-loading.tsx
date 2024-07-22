import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { BeatLoader } from "react-spinners";

export const FormLoading = () => {
  return (
    <div className="bg-yellow-200 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <p>Loading</p>
      <BeatLoader />
    </div>
  );
};
