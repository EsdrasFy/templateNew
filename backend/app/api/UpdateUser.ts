import axios from "axios";

interface RegisterApiResponse {
  status: number;
  msg: string;
}

interface UpdateUserProps {
  userId: number;
  fullname: string;
  username: string;
  email: string;
  profile: string;
  password: string;
  birthdate: Date;
  address: string;
  phone: string;
  gender: string;
  cpf: string;
}

interface RegisterApiResult {
  status?: number;
  msg?: string;
}

async function UpdateUser({
  userId,
  fullname,
  username,
  email,
  password,
  address,
  cpf,
  birthdate,
  gender,
  phone,
  profile,
}: UpdateUserProps): Promise<RegisterApiResult> {
  try {
    const registerUrl = "http://localhost:9090/usuarios/update";
    const { data } = await axios.put<RegisterApiResponse>(registerUrl, {
      user_id: userId,
      fullname,
      username,
      email,
      profile_img: profile,
      password_hash: password,
      date_of_birth: birthdate,
      address,
      phone,
      gender,
      cpf,
    });

    return {
      status: data.status,
      msg: data.msg,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data.msg) {
      return {
        status: error.response.status,
        msg: error.response.data.msg,
      };
    } else {
      return {
        status: 501,
        msg: "Erro desconhecido",
      };
    }
  }
}
export default UpdateUser;
