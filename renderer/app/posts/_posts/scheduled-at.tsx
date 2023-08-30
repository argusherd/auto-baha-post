import { FieldValues, UseFormRegister } from "react-hook-form";

export default function ScheduledAt({
  register,
}: {
  register: UseFormRegister<FieldValues>;
}) {
  return (
    <>
      <label htmlFor="scheduled_at">Schedule</label>
      <input
        type="datetime-local"
        id="scheduled_at"
        step="1"
        {...register("scheduled_at")}
      />
    </>
  );
}
