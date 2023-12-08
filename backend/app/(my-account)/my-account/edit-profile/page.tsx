"use client";
import ButtonPass from "@/app/components/ui/buttonPass";
import InputUi from "@/app/components/ui/InputDefault/input";
import React, { useState, ChangeEvent } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import LogoProfile from "@/app/assets/krgkuf4j.bmp";
import { storage } from "@/app/api/Firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useSession } from "next-auth/react";
import { MdOutlinePhotoCameraBack } from "react-icons/md";
import UpdateUser from "@/app/api/UpdateUser";
import { useRouter } from "next/navigation";
import { ImSpinner9 } from "react-icons/im";

interface Inputs {
  fullname: string;
  username: string;
  email: string;
  phone: string;
  cep?: string;
  address?: string;
  cpf: string;
  file?: FileList;
  birthdate: Date;
}
const phoneSchema = yup
  .string()
  .matches(
    /^(\+\d{1,2}\s?)?(\(\d{1,4}\)|\d{1,4})([\s.-]?\d{1,}){1,14}$/,
    "Por favor, insira um número de telefone válido"
  );
const cpfSchema = yup
  .string()
  .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido");

const schema = yup.object().shape({
  fullname: yup
    .string()
    .required("Este campo é obrigatório!")
    .min(8, "O mínimo de caracteres são 8."),
  username: yup
    .string()
    .required("Este campo é obrigatório!")
    .min(5, "O mínimo de caracteres são 5."),
  email: yup
    .string()
    .email("Deve ser um email válido!")
    .required("Este campo é obrigatório!"),
  phone: phoneSchema.required("O número de telefone é obrigatório"),
  cep: yup.string().matches(/^[0-9]{5}-[0-9]{3}$/, "CEP inválido"),
  address: yup.string(),
  cpf: cpfSchema.required("This field is required!"),
  birthdate: yup
    .date()
    .required("A data de nascimento é obrigatória.")
    .test("is-adult", "Você deve ter pelo menos 18 anos.", function (value) {
      const cutoffDate = new Date();
      cutoffDate.setFullYear(cutoffDate.getFullYear() - 18);
      return value && value <= cutoffDate;
    }),
});
interface EditProfile {
  sessionUser: any;
}
function page({ sessionUser }: EditProfile) {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imgUrl, setImgUrl] = useState("");
  const router = useRouter();

  const { data: session, status, update } = useSession();
  const [selectedImage, setSelectedImage] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const file = data.file;
    const gender = "Male";
    const userId = session?.user.user_id;
    const password = session?.user.password_hash;
    if (!userId || !password) {
      return console.log("ntem");
    }
    if (!file || file.length === 0) {
      return console.log("n tem");
    }
    try {
      setLoading(true);
      const storageRef = ref(storage, `images/${file[0].name}`);
      const uploadTask = uploadBytesResumable(storageRef, file[0]);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          alert(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setImgUrl(url);
          });
        }
      );
      const { status, msg }: any = await UpdateUser({
        userId,
        gender,
        profile: imgUrl,
        password,
        fullname: data.fullname,
        username: data.username,
        email: data.email,
        phone: data.phone,
        birthdate: data.birthdate,
        address: data.address || "",
        cpf: data.cpf ? data.cpf.toString() : "",
      });

      console.log(status);
      if (status === 200) {
        update();
      }
      console.log(msg);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const toggleProfile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <section className="min-h-screen w-full flex items-start justify-center bg-custom-grayOne">
      <main className="max-w-[900px] w-full mx-8 bg-custom-grayOne flex  shadow-snipped relative h-fit  flex-col mt-36 mb-36">
        <span
          className="absolute left-0 w-full h-24
         bg-custom-grayTwo dark:bg-custom-grayThree z-0"
        ></span>

        <form
          className="z-40 flex items-center justify-center w-full flex-col px-20"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="relative">
            <div className="max-w-[150px] w-full min-h-[150px] max-h-[150px] border-[7px] border-custom-grayOne z-0 mt-7 relative rounded-full overflow-hidden">
              <Image
                alt="profile logo"
                src={
                  selectedImage ||
                  session?.user.profile_img ||
                  "https://as1.ftcdn.net/v2/jpg/03/39/45/96/1000_F_339459697_XAFacNQmwnvJRqe1Fe9VOptPWMUxlZP8.jpg"
                }
                className="max-h-[115px] max-w-[115px] rounded-full object-cover"
                width={115}
                height={115}
              />
            </div>

            <label
              htmlFor="fileInput"
              className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-48%] cursor-pointer "
            >
              <input
                {...register("file")}
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={toggleProfile}
                className="sr-only"
                disabled={loading ? true : false}
              />
              <div className="w-[120px] h-[120px] rounded-full flex items-center justify-center border-custom-grayOne bg-custom-grayOne/60 border-[2px] duration-300 ease-linear hover:bg-custom-grayTwo/90">
                <MdOutlinePhotoCameraBack className="text-5xl text-custom-textColor/60" />
              </div>
            </label>
          </div>
          <div className="mt-5 w-full flex flex-col items-start">
            <InputUi
              type="text"
              label="Username"
              pleaceholder="neydelas011"
              classname="w-full text-custom-textColor"
              name="username"
              register={register}
              error={errors?.username?.message}
              disabled={loading ? true : false}
              defaultvalue={session?.user.username}
            />
            <InputUi
              type="text"
              label="Fullname"
              pleaceholder="Neymar Santos Junior"
              classname="w-full text-custom-textColor"
              name="fullname"
              register={register}
              error={errors?.fullname?.message}
              disabled={loading ? true : false}
              defaultvalue={session?.user.fullname}
            />
            <InputUi
              type="email"
              label="Email"
              pleaceholder="neymar.arabia@gmail.com"
              classname="w-full text-custom-textColor"
              name="email"
              register={register}
              error={errors?.email?.message}
              disabled={loading ? true : false}
              defaultvalue={session?.user.email}
            />
            <InputUi
              type="text"
              label="CPF"
              pleaceholder="xxx.xxx.xxx-xx"
              classname="w-full text-custom-textColor"
              name="cpf"
              register={register}
              error={errors?.cpf?.message}
              disabled={loading ? true : false}
              defaultvalue={session?.user.cpf}
            />
            <div className="flex justify-between w-full gap-9">
              <div className="w-1/2 flex gap-[1px] flex-col">
                <InputUi
                  type="date"
                  label="Date of birth"
                  pleaceholder=""
                  classname="w-full text-custom-textColor inputDate"
                  name="birthdate"
                  register={register}
                  error={errors?.birthdate?.message}
                  disabled={loading ? true : false}
                  defaultvalue={session?.user.date_of_birth}
                />
              </div>
              <div className="w-1/2 flex gap-[1px] flex-col">
                <InputUi
                  type="text"
                  label="Phone"
                  pleaceholder="11 99999-9999"
                  classname="w-full text-custom-textColor"
                  name="phone"
                  register={register}
                  error={errors?.phone?.message}
                  disabled={loading ? true : false}
                  defaultvalue={session?.user.phone}
                />
              </div>
            </div>
            <div className="flex justify-between w-full gap-9">
              <div className="w-1/2 flex gap-[1px] flex-col">
                <InputUi
                  type="text"
                  label="Address"
                  pleaceholder="Rua Vereda Alfa, 35"
                  classname="w-full text-custom-textColor"
                  name="address"
                  register={register}
                  error={errors?.address?.message}
                  disabled={loading ? true : false}
                  defaultvalue={session?.user.address}
                />
              </div>
              <div className="w-1/2 flex gap-[1px] flex-col">
                <InputUi
                  type="text"
                  label="Cep"
                  pleaceholder="08450000"
                  classname="w-full text-custom-textColor"
                  name="cep"
                  register={register}
                  error={errors?.cep?.message}
                  disabled={loading ? true : false}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end w-full gap-4 text-custom-textColor font-semibold mt-6 pb-6">
            <button
              type="button"
              className="py-2 px-6 border-2 border-custom-pink/40 rounded-md hover:bg-custom-pink duration-300 ease-linear"
              onClick={() => router.back()}
              disabled={loading ? true : false}
            >
              Cancel
            </button>
            {loading ? (
              <span className="py-2 px-6 bg-custom-pink rounded-md">
                <ImSpinner9 className="animate-spin text-3xl" />
              </span>
            ) : (
              <button
                type="submit"
                className="py-2 px-6 bg-custom-pink/40 rounded-md hover:bg-custom-pink duration-300 ease-linear"
              >
                Save
              </button>
            )}
          </div>
        </form>
        <br />
      </main>
    </section>
  );
}
export default page;
