import { FieldValidationError } from "express-validator";
import { FieldValues, UseFormSetError } from "react-hook-form";

export default async function handleFormRequest(
  callback: Function,
  setError: UseFormSetError<FieldValues>,
) {
  try {
    await callback();
  } catch (error) {
    if (error.response?.status === 422) {
      error.response.data.errors.forEach((item: FieldValidationError) => {
        setError(item.path, { message: item.msg });
      });
    }
  }
}
