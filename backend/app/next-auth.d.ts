import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    msg: string;
    status: number;
    user: {
      user_id:number;
      fullname: string;
      username: string;
      email: string;
      profile_img: string;
      password_hash: string;
      date_of_birth?: Date;
      address: string;
      phone: string;
      shopping?: number;
      gender: string;
      cpf: string;
      cards?: number;
      created_at: Date;
      messages?: number;
    };
  }
}
