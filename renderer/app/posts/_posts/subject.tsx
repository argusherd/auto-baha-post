import { useFormContext } from "react-hook-form";

export default function Subject() {
  const { register } = useFormContext();

  return (
    <select
      className="rounded border p-1"
      placeholder="Subject"
      {...register("subject")}
    >
      <option value="1">問題</option>
      <option value="2">情報</option>
      <option value="3">心得</option>
      <option value="4">討論</option>
      <option value="5">攻略</option>
      <option value="6">密技</option>
      <option value="7">閒聊</option>
      <option value="8">其他</option>
      <option value="9">空白</option>
    </select>
  );
}
