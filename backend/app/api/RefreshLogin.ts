import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

type AuthResult = {
  success: boolean;
  error?: string;
};

interface refreshLoginProps {
  credential: string;
  password: string;
}

export const refreshLogin = async ({
  credential,
  password,
}: refreshLoginProps): Promise<AuthResult> => {
  const router = useRouter();
  const { data: session } = useSession();

  if (!session) {
    // Se o usuário não estiver autenticado, redirecione para a página de login
    router.push("/login");
    return { success: false, error: "Usuário não autenticado" };
  }

  // Parâmetros de signIn podem variar dependendo do seu provedor
  const result = await signIn("credentials", {
    credential: credential,
    password: password,
    redirect: false, 
  });

  if (result?.error) {
    // Lidar com erro de autenticação
    console.error(result.error);
    return { success: false, error: "Erro durante a reautenticação" };
  }

  // Sucesso na autenticação, faça qualquer lógica necessária
  console.log("Usuário reautenticado com sucesso");
  return { success: true };
};
