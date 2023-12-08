import User from "../models/User";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
require("dotenv").config();
import jwt from "jsonwebtoken";
import { Model } from "sequelize";
import nodemailer from "nodemailer";

interface UserInterface extends Model<any, any> {
  user_id: number;
  fullname: string;
  username: string;
  email: string;
  profile_img: string;
  password_hash: string;
  date_of_birth: Date;
  address: string;
  phone: string;
  shopping: number;
  gender: string;
  cpf: string;
  cards: number;
  created_at: Date;
  messages: number;
}

async function createUser(req: Request, res: Response) {
  try {
    const {
      fullname,
      username,
      email,
      profile_img,
      password_hash,
      date_of_birth,
      address,
      phone,
      shopping,
      gender,
      cpf,
      cards,
    } = req.body;

    if (!username || username.length < 3) {
      return res.status(422).json({ msg: "Padrão de usuário incorreto!" });
    }

    if (!fullname || fullname.length < 10) {
      return res.status(422).json({ msg: "Necessário nome completo!" });
    }

    if (!email) {
      return res.status(422).json({ msg: "Necessário email!" });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(422).json({ msg: "Formato de e-mail inválido!" });
    }

    if (!password_hash || password_hash.length < 6) {
      return res.status(422).json({
        msg: "Senha fraca! Use uma senha com pelo menos 6 caracteres.",
      });
    }
    const existingCPF = (await User.findOne({
      where: {
        cpf: cpf,
      },
    })) as UserInterface;
    if (existingCPF && cpf !== null) {
      return res.status(400).json({ msg: "CPF já está em uso." });
    }

    const existingEmail = await User.findOne({
      where: {
        email: email,
      },
    });
    if (existingEmail) {
      return res.status(400).json({ msg: "Email já está em uso." });
    }

    const existingUsername = await User.findOne({
      where: {
        username: username,
      },
    });
    if (existingUsername) {
      return res.status(400).json({ msg: "Username já está em uso." });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password_hash, salt);

    const usuario = await User.create({
      fullname,
      username,
      email,
      profile_img,
      password_hash: passwordHash,
      date_of_birth,
      address,
      phone,
      shopping,
      gender,
      cpf,
      cards,
    });

    res.status(201).json({ user: usuario, status: 201 });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
}

async function updateUser(req: Request, res: Response) {
  const {
    user_id,
    fullname,
    username,
    email,
    profile_img,
    password_hash,
    date_of_birth,
    address,
    phone,
    gender,
    cpf,
  } = req.body;
  console.log(address + "address");
  try {
    const user = (await User.findOne({
      where: {
        user_id: user_id,
      },
    })) as UserInterface;

    const existingCPF = (await User.findOne({
      where: {
        cpf: cpf,
      },
    })) as UserInterface;

    if (existingCPF && existingCPF.user_id !== user.user_id) {
      return res.status(400).json({ msg: "CPF já está em uso." });
    }

    const existingEmail = (await User.findOne({
      where: {
        email: email,
      },
    })) as UserInterface;
    console.log("Existing Email User:", existingEmail);
    if (existingEmail && existingEmail.user_id !== user.user_id) {
      console.log("Email já está em uso por outro usuário.");
      return res.status(400).json({ msg: "Email já está em uso." });
    }

    const existingUsername = (await User.findOne({
      where: {
        username: username,
      },
    })) as UserInterface;
    if (existingUsername && existingUsername.user_id !== user.user_id) {
      return res.status(400).json({ msg: "Username já está em uso." });
    }

    const [updatedRows] = await User.update(
      {
        username: username,
        fullname: fullname,
        email: email,
        profile_img: profile_img,
        password_hash: password_hash,
        date_of_birth: date_of_birth,
        address: address,
        phone: phone,
        gender: gender,
        cpf: cpf,
      },
      {
        where: { user_id: user_id },
      }
    );
    if (!username || username.length < 3) {
      return res.status(422).json({ msg: "Padrão de usuário incorreto!" });
    }
    if (!fullname || fullname.length < 10) {
      return res.status(422).json({ msg: "Necessário nome completo!" });
    }
    if (!email) {
      return res.status(422).json({ msg: "Necessário email!" });
    }
    if (!password_hash || password_hash.length < 6) {
      return res.status(422).json({ msg: "Padrão de senha incorreto!" });
    }
    if (!gender) {
      return res.status(422).json({ msg: "Especifique seu gênero!" });
    }
    if (updatedRows > 0) {
      return res
        .status(200)
        .json({ msg: "Atualização bem-sucedida", status: 200 });
    } else {
      return res
        .status(404)
        .json({ msg: "Usuário não encontrado", status: 404 });
    }
  } catch (error) {
    console.error("Erro ao atualizar usuários:", error);
    return res
      .status(500)
      .json({ msg: "Erro ao atualizar usuários", status: 500 });
  }
}
async function deleteUser(req: Request, res: Response) {
  const id = req.params.id;

  try {
    if (!id) {
      return res.status(400).json({ msg: "ID é necessário na requisição." });
    }

    const existingUser = (await User.findOne({
      where: {
        user_id: id,
      },
    })) as UserInterface;

    if (!existingUser) {
      return res.status(404).json({ msg: "Usuário não encontrado." });
    }

    await User.destroy({
      where: { user_id: id },
    });

    res.status(200).json({
      msg: `Usuário com ID ${id} foi deletado da base de dados.`,
      status: 200,
    });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
}

async function login(req: Request, res: Response) {
  const { credential, password } = req.body;

  if (!credential || !password) {
    return res.status(400).json({ msg: "Credenciais inválidas" });
  }

  let user: any;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailPattern.test(credential)) {
    user = (await User.findOne({
      where: { email: credential },
    })) as UserInterface;
  } else {
    user = (await User.findOne({
      where: { username: credential },
    })) as UserInterface;
  }

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado!" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    return res.status(401).json({ msg: "Senha incorreta!" });
  }
  try {
    const secret = process.env.SECRET;

    if (secret !== undefined) {
      const token = jwt.sign(
        {
          id: user.user_id,
        },
        secret
      );
      console.log(user);
      res.status(200).json({
        msg: "Login bem sucedido",
        token: token,
        user: user,
        id: user.user_id,
      });
    } else {
      console.error("A variável de ambiente TOKEN não está definida.");
    }
  } catch (error) {
    res.status(500).json({ msg: "aconteceu um erro no servidor" });
  }
}

async function authLogin(req: Request, res: Response) {
  const id = req.params.id;
  try {
    if (!id) {
      return res.status(404).json({ msg: "Usuario nao encontrado" });
    }
    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ["password_hash"] },
    });

    if (!user) {
      return res.status(404).json({ msg: "Usuario nao encontrado" });
    }
    res.status(200).json({ user, status: 200 });
  } catch (error) {
    console.error("Erro ao recuperar usuário:", error);
    res.status(500).json({ msg: "Erro Interno do Servidor" });
  }
}
async function showUser(req: Request, res: Response) {
  const id = req.params.id;
  try {
    if (!id) {
      return res.status(404).json({ msg: "Usuario nao encontrado" });
    }
    const user = (await User.findOne({
      where: { id },
      attributes: { exclude: ["password_hash"] },
    })) as UserInterface;

    if (!user) {
      return res.status(404).json({ msg: "Usuario nao encontrado" });
    }
    res.status(200).json({ user, status: 200, id: user.user_id });
  } catch (error) {
    console.error("Erro ao recuperar usuário:", error);
    res.status(500).json({ msg: "Erro Interno do Servidor" });
  }
}
async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;
  try {
    const user = (await User.findOne({
      where: { email: email },
    })) as UserInterface;

    if (!user) {
      return res.send("User Not Exist!").status(404);
    }

    let number = Math.floor(Math.random() * 1000000);
    let code = number.toString().padStart(6, "0");
    res.cookie("code", code, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      secure: true,
      domain: "localhost",
      sameSite: "lax",
    });
    console.log(code);
    const emailHtml = `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
  <title> Welcome to [Coded Mails] </title>
  <!--[if !mso]><!-- -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--<![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
    #outlook a {
      padding: 0;
    }

    body {
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    table,
    td {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }

    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }

    p {
      display: block;
      margin: 13px 0;
    }
  </style>
  <!--[if mso]>
        <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
  <!--[if lte mso 11]>
        <style type="text/css">
          .mj-outlook-group-fix { width:100% !important; }
        </style>
        <![endif]-->
  <!--[if !mso]><!-->
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    @import url(https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap);
  </style>
  <!--<![endif]-->
  <style type="text/css">
    @media only screen and (min-width:480px) {
      .mj-column-per-100 {
        width: 100% !important;
        max-width: 100%;
      }
    }
  </style>
  <style type="text/css">
    @media only screen and (max-width:480px) {
      table.mj-full-width-mobile {
        width: 100% !important;
      }

      td.mj-full-width-mobile {
        width: auto !important;
      }
    }
  </style>
  <style type="text/css">
    a,
    span,
    td,
    th {
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
    }
  </style>
</head>

<body style="background-color:#f3f3f5;">
  <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;"> Preview - Welcome to Coded Mails </div>
  <div style="background-color:#f3f3f5;">
    <!--[if mso | IE]>
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    <div style="margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
              <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:600px;"
            >
          <![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                    <td style="font-size:0px;word-break:break-word;">
                      <!--[if mso | IE]>
    
        <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td height="20" style="vertical-align:top;height:20px;">
      
    <![endif]-->
                      <div style="height:20px;"> &nbsp; </div>
                      <!--[if mso | IE]>
    
        </td></tr></table>
      
    <![endif]-->
                    </td>
                  </tr>
                </table>
              </div>
              <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      
        <v:rect  style="width:600px;" xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false">
        <v:fill  origin="0.5, 0" position="0.5, 0" src="https://www.transparenttextures.com/patterns/brushed-alum.png" color="#00AD55" type="tile" />
        <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
      <![endif]-->
    <div style="background:#00AD55 url(https://www.transparenttextures.com/patterns/brushed-alum.png) top center / auto repeat;margin:0px auto;border-radius:4px 4px 0 0;max-width:600px;">
      <div style="line-height:0;font-size:0;">
        <table align="center" background="https://www.transparenttextures.com/patterns/brushed-alum.png" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#00AD55 url(https://www.transparenttextures.com/patterns/brushed-alum.png) top center / auto repeat;width:100%;border-radius:4px 4px 0 0;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:600px;"
            >
          <![endif]-->
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                    <tbody>
                      <tr>
                        <td style="vertical-align:top;padding:40px;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style width="100%">
                            <tr>
                              <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                  <tbody>
                                    <tr>
                                      <td style="width:150px;">
                                        <img height="auto" src="../../../images/logo-white.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="150">
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!--[if mso | IE]>
        </v:textbox>
      </v:rect>
    
          </td>
        </tr>
      </table>
      
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;border-radius:0 0 4px 4px;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;border-radius:0 0 4px 4px;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:40px 10px;text-align:center;">
              <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:580px;"
            >
          <![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <div style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:20px;font-weight:300;line-height:30px;text-align:left;color:#003366;">
                        <p style="margin: 0;">Hello Jane,</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <div style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:20px;font-weight:300;line-height:30px;text-align:left;color:#003366;">
                        <p style="margin: 0;"> We’ve received a request to reset the password for the Coded Mails account associated with hello@domain.com. </p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <div style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:20px;font-weight:300;line-height:30px;text-align:left;color:#003366;">
                        <p style="margin: 0;"> You can reset your password by clicking the link below: </p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" vertical-align="middle" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                        <tr>
                          <td align="center" bgcolor="#043768" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#043768;" valign="middle">
                            <a href="https://google.com" style="display: inline-block; background: #043768; color: white; font-family: Poppins, Helvetica, Arial, sans-serif; font-size: 18px; font-weight: normal; line-height: 30px; margin: 0; text-decoration: none; text-transform: none; padding: 10px 25px; mso-padding-alt: 0px; border-radius: 3px;" target="_blank"> Reset your password </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>
              <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    <div style="background:#d5d5d5;background-color:#d5d5d5;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#d5d5d5;background-color:#d5d5d5;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
              <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:600px;"
            >
          <![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <div style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:14px;font-weight:300;line-height:20px;text-align:left;color:#043768;">
                        <p style="margin: 0;">If you did not request a new password, please let us know immediately by replying to this email.</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
              <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    <div style="background:#043768;background-color:#043768;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#043768;background-color:#043768;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
              <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:600px;"
            >
          <![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <div style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:16px;font-weight:500;line-height:30px;text-align:left;color:#ffffff;">
                        <p style="margin: 0;"> 123 Medalling Jr., Suite 100, Parrot Park, CA 12345 </p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <div style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:16px;font-weight:500;line-height:30px;text-align:left;color:#ffffff;">
                        <p style="margin: 0;"> Copyright © 2029 Coded Mails<br> All rights reserved.</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
              <!--[if mso | IE]>
            </td>
          
            <td
               class="" style="vertical-align:top;width:600px;"
            >
          <![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <!--[if mso | IE]>
      <table
         align="left" border="0" cellpadding="0" cellspacing="0" role="presentation"
      >
        <tr>
      
              <td>
            <![endif]-->
                      <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;">
                        <tr>
                          <td style="padding:4px;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:3px;width:18px;">
                              <tr>
                                <td style="font-size:0;height:18px;vertical-align:middle;width:18px;">
                                  <a href="#" target="_blank" style="color: #00AD55;">
                                    <img alt="twitter-logo" height="18" src="../../../images/social/white/twitter-logo-transparent-white.png" style="border-radius:3px;display:block;" width="18">
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <!--[if mso | IE]>
              </td>
            
              <td>
            <![endif]-->
                      <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;">
                        <tr>
                          <td style="padding:4px;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:3px;width:18px;">
                              <tr>
                                <td style="font-size:0;height:18px;vertical-align:middle;width:18px;">
                                  <a href="#" target="_blank" style="color: #00AD55;">
                                    <img alt="facebook-logo" height="18" src="../../../images/social/white/facebook-logo-transparent-white.png" style="border-radius:3px;display:block;" width="18">
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <!--[if mso | IE]>
              </td>
            
              <td>
            <![endif]-->
                      <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;">
                        <tr>
                          <td style="padding:4px;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:3px;width:18px;">
                              <tr>
                                <td style="font-size:0;height:18px;vertical-align:middle;width:18px;">
                                  <a href="#" target="_blank" style="color: #00AD55;">
                                    <img alt="instagram-logo" height="18" src="../../../images/social/white/instagram-logo-transparent-white.png" style="border-radius:3px;display:block;" width="18">
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <!--[if mso | IE]>
              </td>
            
              <td>
            <![endif]-->
                      <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;">
                        <tr>
                          <td style="padding:4px;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:3px;width:18px;">
                              <tr>
                                <td style="font-size:0;height:18px;vertical-align:middle;width:18px;">
                                  <a href="#" target="_blank" style="color: #00AD55;">
                                    <img alt="youtube-logo" height="18" src="../../../images/social/white/youtube-logo-transparent-white.png" style="border-radius:3px;display:block;" width="18">
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <!--[if mso | IE]>
              </td>
            
          </tr>
        </table>
      <![endif]-->
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <div style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:16px;font-weight:500;line-height:30px;text-align:left;color:#ffffff;">Update your <a class="footer-link" href="https://google.com" style="color: #fff; text-decoration: underline;">email preferences</a> to choose the types of emails you receive, or you can <a class="footer-link" href="https://google.com" style="color: #fff; text-decoration: underline;"> unsubscribe </a>from all future emails.</div>
                    </td>
                  </tr>
                </table>
              </div>
              <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    <div style="margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
              <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:600px;"
            >
          <![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                    <td style="font-size:0px;word-break:break-word;">
                      <!--[if mso | IE]>
    
        <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td height="1" style="vertical-align:top;height:1px;">
      
    <![endif]-->
                      <div style="height:1px;"> &nbsp; </div>
                      <!--[if mso | IE]>
    
        </td></tr></table>
      
    <![endif]-->
                    </td>
                  </tr>
                </table>
              </div>
              <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      <![endif]-->
  </div>
</body>

</html><!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
  <title> Welcome to [Coded Mails] </title>
  <!--[if !mso]><!-- -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--<![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
    #outlook a {
      padding: 0;
    }

    body {
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    table,
    td {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }

    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }

    p {
      display: block;
      margin: 13px 0;
    }
  </style>
  <!--[if mso]>
        <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
  <!--[if lte mso 11]>
        <style type="text/css">
          .mj-outlook-group-fix { width:100% !important; }
        </style>
        <![endif]-->
  <!--[if !mso]><!-->
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    @import url(https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap);
  </style>
  <!--<![endif]-->
  <style type="text/css">
    @media only screen and (min-width:480px) {
      .mj-column-per-100 {
        width: 100% !important;
        max-width: 100%;
      }
    }
  </style>
  <style type="text/css">
    @media only screen and (max-width:480px) {
      table.mj-full-width-mobile {
        width: 100% !important;
      }

      td.mj-full-width-mobile {
        width: auto !important;
      }
    }
  </style>
  <style type="text/css">
    a,
    span,
    td,
    th {
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
    }
  </style>
</head>

<body style="background-color:#f3f3f5;">
  <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;"> Preview - Welcome to Coded Mails </div>
  <div style="background-color:#f3f3f5;">
    <!--[if mso | IE]>
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    <div style="margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
              <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:600px;"
            >
          <![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                    <td style="font-size:0px;word-break:break-word;">
                      <!--[if mso | IE]>
    
        <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td height="20" style="vertical-align:top;height:20px;">
      
    <![endif]-->
                      <div style="height:20px;"> &nbsp; </div>
                      <!--[if mso | IE]>
    
        </td></tr></table>
      
    <![endif]-->
                    </td>
                  </tr>
                </table>
              </div>
              <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      
        <v:rect  style="width:600px;" xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false">
        <v:fill  origin="0.5, 0" position="0.5, 0" src="https://www.transparenttextures.com/patterns/brushed-alum.png" color="#00AD55" type="tile" />
        <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
      <![endif]-->
    <div style="background:#00AD55 url(https://www.transparenttextures.com/patterns/brushed-alum.png) top center / auto repeat;margin:0px auto;border-radius:4px 4px 0 0;max-width:600px;">
      <div style="line-height:0;font-size:0;">
        <table align="center" background="https://www.transparenttextures.com/patterns/brushed-alum.png" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#00AD55 url(https://www.transparenttextures.com/patterns/brushed-alum.png) top center / auto repeat;width:100%;border-radius:4px 4px 0 0;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:600px;"
            >
          <![endif]-->
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                    <tbody>
                      <tr>
                        <td style="vertical-align:top;padding:40px;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style width="100%">
                            <tr>
                              <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                  <tbody>
                                    <tr>
                                      <td style="width:150px;">
                                        <img height="auto" src="../../../images/logo-white.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="150">
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!--[if mso | IE]>
        </v:textbox>
      </v:rect>
    
          </td>
        </tr>
      </table>
      
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;border-radius:0 0 4px 4px;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;border-radius:0 0 4px 4px;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:40px 10px;text-align:center;">
              <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:580px;"
            >
          <![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <div style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:20px;font-weight:300;line-height:30px;text-align:left;color:#003366;">
                        <p style="margin: 0;">Hello Jane,</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <div style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:20px;font-weight:300;line-height:30px;text-align:left;color:#003366;">
                        <p style="margin: 0;"> We’ve received a request to reset the password for the Coded Mails account associated with hello@domain.com. </p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <div style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:20px;font-weight:300;line-height:30px;text-align:left;color:#003366;">
                        <p style="margin: 0;"> You can reset your password by clicking the link below: </p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" vertical-align="middle" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                        <tr>
                          <td align="center" bgcolor="#043768" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#043768;" valign="middle">
                            <a href="https://google.com" style="display: inline-block; background: #043768; color: white; font-family: Poppins, Helvetica, Arial, sans-serif; font-size: 18px; font-weight: normal; line-height: 30px; margin: 0; text-decoration: none; text-transform: none; padding: 10px 25px; mso-padding-alt: 0px; border-radius: 3px;" target="_blank"> Reset your password </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>
              <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    <div style="background:#d5d5d5;background-color:#d5d5d5;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#d5d5d5;background-color:#d5d5d5;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
              <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:600px;"
            >
          <![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <div style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:14px;font-weight:300;line-height:20px;text-align:left;color:#043768;">
                        <p style="margin: 0;">If you did not request a new password, please let us know immediately by replying to this email.</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
              <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    <div style="background:#043768;background-color:#043768;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#043768;background-color:#043768;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
              <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:600px;"
            >
          <![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <div style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:16px;font-weight:500;line-height:30px;text-align:left;color:#ffffff;">
                        <p style="margin: 0;"> 123 Medalling Jr., Suite 100, Parrot Park, CA 12345 </p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <div style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:16px;font-weight:500;line-height:30px;text-align:left;color:#ffffff;">
                        <p style="margin: 0;"> Copyright © 2029 Coded Mails<br> All rights reserved.</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
              <!--[if mso | IE]>
            </td>
          
            <td
               class="" style="vertical-align:top;width:600px;"
            >
          <![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <!--[if mso | IE]>
      <table
         align="left" border="0" cellpadding="0" cellspacing="0" role="presentation"
      >
        <tr>
      
              <td>
            <![endif]-->
                      <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;">
                        <tr>
                          <td style="padding:4px;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:3px;width:18px;">
                              <tr>
                                <td style="font-size:0;height:18px;vertical-align:middle;width:18px;">
                                  <a href="#" target="_blank" style="color: #00AD55;">
                                    <img alt="twitter-logo" height="18" src="../../../images/social/white/twitter-logo-transparent-white.png" style="border-radius:3px;display:block;" width="18">
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <!--[if mso | IE]>
              </td>
            
              <td>
            <![endif]-->
                      <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;">
                        <tr>
                          <td style="padding:4px;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:3px;width:18px;">
                              <tr>
                                <td style="font-size:0;height:18px;vertical-align:middle;width:18px;">
                                  <a href="#" target="_blank" style="color: #00AD55;">
                                    <img alt="facebook-logo" height="18" src="../../../images/social/white/facebook-logo-transparent-white.png" style="border-radius:3px;display:block;" width="18">
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <!--[if mso | IE]>
              </td>
            
              <td>
            <![endif]-->
                      <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;">
                        <tr>
                          <td style="padding:4px;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:3px;width:18px;">
                              <tr>
                                <td style="font-size:0;height:18px;vertical-align:middle;width:18px;">
                                  <a href="#" target="_blank" style="color: #00AD55;">
                                    <img alt="instagram-logo" height="18" src="../../../images/social/white/instagram-logo-transparent-white.png" style="border-radius:3px;display:block;" width="18">
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <!--[if mso | IE]>
              </td>
            
              <td>
            <![endif]-->
                      <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;">
                        <tr>
                          <td style="padding:4px;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:3px;width:18px;">
                              <tr>
                                <td style="font-size:0;height:18px;vertical-align:middle;width:18px;">
                                  <a href="#" target="_blank" style="color: #00AD55;">
                                    <img alt="youtube-logo" height="18" src="../../../images/social/white/youtube-logo-transparent-white.png" style="border-radius:3px;display:block;" width="18">
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <!--[if mso | IE]>
              </td>
            
          </tr>
        </table>
      <![endif]-->
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <div style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:16px;font-weight:500;line-height:30px;text-align:left;color:#ffffff;">Update your <a class="footer-link" href="https://google.com" style="color: #fff; text-decoration: underline;">email preferences</a> to choose the types of emails you receive, or you can <a class="footer-link" href="https://google.com" style="color: #fff; text-decoration: underline;"> unsubscribe </a>from all future emails.</div>
                    </td>
                  </tr>
                </table>
              </div>
              <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    <div style="margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
              <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:600px;"
            >
          <![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                    <td style="font-size:0px;word-break:break-word;">
                      <!--[if mso | IE]>
    
        <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td height="1" style="vertical-align:top;height:1px;">
      
    <![endif]-->
                      <div style="height:1px;"> &nbsp; </div>
                      <!--[if mso | IE]>
    
        </td></tr></table>
      
    <![endif]-->
                    </td>
                  </tr>
                </table>
              </div>
              <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      <![endif]-->
  </div>
</body>

</html>
  `;
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "contatoesdrasoficial@gmail.com",
        pass: "xcxjmpheutkwxdsi",
      },
    });
    transport
      .sendMail({
        from: "Urban Vogue",
        to: "fernaando.esdras@gmail.com",
        subject: "Send Code",
        html: emailHtml,
      })
      .then((response) => {
        console.log(response);
        return res.status(200).json({ code, status: 200, id: user.user_id });
      })
      .catch((err) => {
        console.error(err);
        return res.status(501).json({ msg: "Error in Server" });
      });
  } catch (error) {
    return res.status(501).json({ msg: "Error in Server" });
  }
}

async function resetPassword(req: Request, res: Response) {
  const { id, code } = req.params;
  const codeCookie = req.cookies.code;
  console.log(code, codeCookie);

  if (!codeCookie) {
    return res.status(401).json({ msg: "Expired code!" });
  }
  if (code !== codeCookie || !code) {
    return res.status(401).json({ msg: "Incorrect code!" });
  }
  const oldUser = (await User.findOne({
    where: { user_id: id },
  })) as UserInterface;
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  return res.status(200).json({ msg: "verified code", id: oldUser.user_id });
}

async function newPassword(req: Request, res: Response) {
  const { id, code } = req.params;
  const codeCookie = req.cookies.code;
  const { password } = req.body;
  console.log(code, codeCookie);

  if (!codeCookie) {
    return res.status(401).json({ msg: "Expired code!" });
  }
  if (code !== codeCookie || !code) {
    return res.status(401).json({ msg: "Incorrect code!" });
  }
  if (!password) {
    return res.status(401).json({ msg: "Enter a correct password!" });
  }
  const oldUser = (await User.findOne({
    where: { user_id: id },
  })) as UserInterface;
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  await User.update(
    { password_hash: passwordHash },

    { where: { user_id: id } }
  );
  return res
    .status(200)
    .json({ msg: "verified code", id: oldUser.user_id, status: 200 });
}

export default {
  createUser,
  updateUser,
  deleteUser,
  login,
  authLogin,
  forgotPassword,
  resetPassword,
  newPassword,
  showUser,
};
