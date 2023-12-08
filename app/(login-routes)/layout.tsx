import React from "react";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../api/auth/[...nextauth]/route";
import { ChakraProvider} from "@chakra-ui/react";
import { redirect } from "next/navigation";
interface LoginLayoutProps {
  children: React.ReactNode;
}

async function LoginLayout({ children }: LoginLayoutProps) {
  const session = await getServerSession(nextAuthOptions);
  if (session) {
    redirect("/my-account");
  }

  return (
    <ChakraProvider>
      <div>{children}</div>;
    </ChakraProvider>
  );
}

export default LoginLayout;
