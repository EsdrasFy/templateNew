import axios from "axios";

interface RegisterApiResponse {
  status: number;
  msg: string;
}

interface LoginApiProps {
  fullname: string;
  username: string;
  email: string;
  password: string;
}

interface RegisterApiResult {
  successfully: string;
  state: boolean;
  msg?: string;
}

async function RegisterApi({
  fullname,
  username,
  email,
  password,
}: LoginApiProps): Promise<RegisterApiResult> {
  try {
    const registerUrl = "http://localhost:9090/usuarios/create";
    const { data } = await axios.post<RegisterApiResponse>(registerUrl, {
      fullname,
      username,
      email,
      password_hash: password,
      cpf: null,
    });

    return {
      successfully: "Successfully!",
      state: true,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data.msg) {
      return {
        successfully: "Failure!",
        state: false,
        msg: error.response.data.msg,
      };
    } else {
      return {
        successfully: "Failure!",
        state: false,
        msg: "Erro desconhecido",
      };
    }
  }
}
export default RegisterApi;
