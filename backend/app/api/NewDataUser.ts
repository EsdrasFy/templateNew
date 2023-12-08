import axios from "axios";

async function NewDataUser(userId: number, tokenTwo: any) {
  try {
    const data = await axios.get(`http://localhost:9090/auth/${userId}`, {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${tokenTwo}`,
      },
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data.msg) {
      return error.response.data.msg;
    }
  }
}

export default NewDataUser;
