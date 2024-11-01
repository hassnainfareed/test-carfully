import { ApplyJobItem } from "@/components/JoinTheTeam";
import axios from "axios";

export async function sendMailApplyJobItem(applyJobItem: ApplyJobItem) {
  var res = await axios.post("/api/mailing", applyJobItem);
  return res.data;
}
