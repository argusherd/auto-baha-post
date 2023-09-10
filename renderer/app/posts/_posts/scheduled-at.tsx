import { useFormContext } from "react-hook-form";

export default function ScheduledAt() {
  const { register } = useFormContext();

  return (
    <>
      <label htmlFor="scheduled_at">Schedule</label>
      <input
        type="datetime-local"
        id="scheduled_at"
        placeholder="Scheduled At"
        {...register("scheduled_at")}
      />
    </>
  );
}
