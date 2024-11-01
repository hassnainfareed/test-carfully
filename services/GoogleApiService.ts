import axios from "axios";

export async function checkRecaptcha(token: string) {
  var res = await axios.post("/api/googleApi", { token: token });
  return res.data;
}
