import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import staffSchema from "../../../../validation/staffSchema";
import useUserService from "../../../../services/useUserService";
import useAuthService from "../../../../services/useAuthService";
import { isEmpty } from "lodash";
import { ToastContainer, toast } from "react-toastify";
import useDarkMode from "../../../../hooks/useDarkMode";
import useWizard from "../../../../hooks/useWizrd";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import random from "random-string-generator";
import useInquiryService from "../../../../services/useInquiryService";
import DropdownFormik from "../../../../components/staff/forms/DropdownFormik";
import { Icon } from "@iconify/react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import useSession from "../../../../hooks/useSession";

const AccountSettings = () => {
  const [initialValues, setInitialValues] = useState({
    first_name: "",
    last_name: "",
    role: "STAFF",
    email: "",
    password: "",
  });
  const [staffs, setStaffs] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const userService = useUserService();
  const authService = useAuthService();
  const inquiryService = useInquiryService();
  const { isDark } = useDarkMode();
  const { index, next, goto } = useWizard(2);
  const [holdOtp, setHoldOtp] = useState(null);
  const [isHide, setIsHide] = useState(true);
  const { session } = useSession();

  useEffect(() => {
    (async () => {
      const getStaffs = await userService.getUsers();
      setStaffs([
        ...getStaffs.filter(
          staff =>
            (staff.role === "STAFF" || staff.role === "ADMIN") &&
            session?.email !== staff.email
        ),
      ]);
    })();
  }, []);

  const handleDelete = async id => {
    await userService.deleteUser(id);
    setStaffs([...staffs.filter(staff => staff._id !== id)]);
  };

  const handleSubmit = async (data, { resetForm }) => {
    try {
      setIsLoading(true);
      let newStaff = {};
      if (data?._id) {
        newStaff = await userService.updateUser(data?._id, data);
        if (!isEmpty(newStaff?.error)) {
          setIsLoading(false);
          toast.error(newStaff?.error, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: isDark ? "dark" : "light",
          });
          return;
        }
        setStaffs([
          ...staffs.map(staff => {
            return staff._id === data._id ? newStaff : staff;
          }),
        ]);
        toast("Successfully Updated!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: isDark ? "dark" : "light",
        });
      } else {
        const checkEmail = await userService.emailCheck({ email: data.email });
        if (checkEmail?.error) {
          toast.error(checkEmail?.error, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: isDark ? "dark" : "light",
          });
          return;
        }
        const generateOtp = random(8);
        const sendEmail = await inquiryService.sendEmail({
          to: data.email,
          from: "chatsistant@gmail.com",
          subject: "Addmission",
          emailVerify: true,
          code: generateOtp,
        });
        setInitialValues({ ...data });
        if (sendEmail?.data?.error?.message) {
          toast.error("Something went wrong!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: isDark ? "dark" : "light",
          });
          return;
        }
        setHoldOtp(generateOtp);
        toast(`Check Your Email ${data.email}!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: isDark ? "dark" : "light",
        });
        next();
      }
      resetForm({
        first_name: "",
        last_name: "",
        role: "STAFF",
        email: "",
        password: "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const Stepper = [
    <Formik
      enableReinitialize
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={staffSchema}
    >
      {({ errors, touched, values, handleChange }) => (
        <Form className="flex flex-col gap-5 text-black/60 dark:text-white">
          <div className="flex gap-5">
            <div className="flex w-full flex-col gap-1">
              <label htmlFor="first_name">First Name</label>
              <Field
                className="rounded-md border-2 border-white/20 bg-[#E8E8E8] p-2 duration-200 focus:outline-[#323745] dark:bg-[#4A5168]"
                id="first_name"
                name="first_name"
                autoComplete="off"
                disabled={isLoading}
              />
              {errors.first_name && touched.first_name ? (
                <div className="text-xs text-red-400">{errors.first_name}</div>
              ) : null}
            </div>
            <div className="flex w-full flex-col gap-1">
              <label htmlFor="last_name">Last Name</label>
              <Field
                className="rounded-md border-2 border-white/20 bg-[#E8E8E8] p-2 duration-200 focus:outline-[#323745] dark:bg-[#4A5168]"
                id="last_name"
                name="last_name"
                autoComplete="off"
                disabled={isLoading}
              />
              {errors.last_name && touched.last_name ? (
                <div className="text-xs text-red-400">{errors.last_name}</div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <Field
              className="rounded-md border-2 border-white/20 bg-[#E8E8E8] p-2 duration-200 focus:outline-[#323745] dark:bg-[#4A5168]"
              id="email"
              name="email"
              autoComplete="off"
              disabled={isLoading}
            />
            {errors.email && touched.email ? (
              <div className="text-xs text-red-400">{errors.email}</div>
            ) : null}
          </div>
          <DropdownFormik
            name={"role"}
            label={"Role"}
            options={["STAFF", "ADMIN"]}
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password</label>
            <div className="relative flex items-center justify-end">
              <Field
                className="w-full rounded-md border-2 border-white/20 bg-[#E8E8E8] p-2 duration-200 focus:outline-[#323745] dark:bg-[#4A5168]"
                type={isHide ? "password" : "text"}
                id="password"
                name="password"
                autoComplete="off"
                disabled={isLoading}
              />
              <Icon
                icon={isHide ? "solar:eye-bold" : "mingcute:eye-close-fill"}
                onClick={() => setIsHide(prev => !prev)}
                className="absolute mr-3 cursor-pointer text-lg"
              />
            </div>
            {errors.password && touched.password ? (
              <div className="text-xs text-red-400">{errors.password}</div>
            ) : null}
          </div>
          {initialValues?._id ? (
            <button
              disabled={isLoading}
              type="submit"
              className=" bg-[#4A5168]/ flex items-center justify-center rounded-md bg-blue-300 p-3 font-bold text-white duration-200 hover:opacity-50 dark:bg-white/30"
            >
              {isLoading ? <LoadingSpinner /> : "Update Info"}
            </button>
          ) : (
            <button
              disabled={isLoading}
              type="submit"
              className=" dark:bg-[#4A5168]/ flex items-center justify-center rounded-md bg-blue-300 p-3 font-bold text-white duration-200 hover:opacity-50 dark:bg-white/30"
            >
              {isLoading ? <LoadingSpinner /> : "Create Staff"}
            </button>
          )}
        </Form>
      )}
    </Formik>,
    <Formik
      enableReinitialize
      validationSchema={Yup.object().shape({
        email: Yup.string().required("Code is required"),
      })}
      onSubmit={async (data, { resetForm }) => {
        if (data.email !== holdOtp) {
          toast.error("Invalid Code", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: isDark ? "dark" : "light",
          });
          return;
        }

        const newStaff = await authService.singUp(initialValues);
        if (!isEmpty(newStaff?.error)) {
          setIsLoading(false);
          toast.error(newStaff?.error, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: isDark ? "dark" : "light",
          });
          return;
        }

        toast(
          `${initialValues.first_name} ${initialValues.last_name} successfully created!`,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: isDark ? "dark" : "light",
          }
        );

        setStaffs([newStaff.data, ...staffs]);
        goto(0);
        setInitialValues({});
        resetForm({});
        setHoldOtp(null);
      }}
      initialValues={{ email: "" }}
    >
      {({ errors, touched }) => (
        <Form className="flex flex-col gap-5 text-black/60 dark:text-white">
          <div className="flex w-full flex-col gap-1">
            <label htmlFor="email">Enter the code for email verfication</label>
            <Field
              className="rounded-md border-2 border-white/20 bg-[#E8E8E8] p-2 duration-200 focus:outline-[#323745] dark:bg-[#4A5168]"
              id="email"
              name="email"
              autoComplete="off"
              disabled={isLoading}
            />
            {errors.email && touched.email ? (
              <div className="text-xs text-red-400">{errors.email}</div>
            ) : null}
          </div>
          <button
            disabled={isLoading}
            type="submit"
            className=" bg-[#4A5168]/ flex items-center justify-center rounded-md bg-blue-300 p-3 font-bold text-white duration-200 hover:opacity-50 dark:bg-white/30"
          >
            {isLoading ? <LoadingSpinner /> : "Continue"}
          </button>
        </Form>
      )}
    </Formik>,
  ];

  if (!staffs)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="flex h-full w-full flex-col gap-5">
      <h1
        className="w-full rounded-b-md rounded-t-lg bg-white p-5 text-center font-productSansBlack 
        text-xl text-black/60 dark:bg-black/50 dark:text-white "
      >
        Account Settings
      </h1>

      <div className="flex h-full w-full gap-5">
        <div className="flex h-full w-full flex-col gap-5 rounded-md bg-white p-5 dark:bg-black/50">
          <h1 className="rounded-md bg-[#8EABF2] p-2 text-center text-white dark:bg-black/30 ">
            Staffs
          </h1>

          <div className="relative flex h-full w-full overflow-y-auto">
            <table className="absolute left-0 top-0 flex h-full w-full flex-col gap-4  text-black/60 dark:text-white">
              <thead className="sticky top-0">
                <tr className=" flex w-full items-center justify-between rounded-b-md rounded-t-lg bg-[#E8E8E8] p-5 text-left font-productSansBlack dark:bg-[#3D4250]">
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th className="">Action</th>
                </tr>
              </thead>
              <tbody className="flex flex-col gap-5">
                {staffs?.map((staff, key) => (
                  <tr
                    key={key}
                    className="flex w-full items-start justify-between rounded-b-md rounded-t-lg bg-[#F7F7F7] p-5 text-left  dark:bg-[#3D4250]"
                  >
                    <Tippy content={staff.first_name + " " + staff.last_name}>
                      <td className="max-w-[50px] cursor-default overflow-hidden text-ellipsis">
                        {staff.first_name + " " + staff.last_name}
                      </td>
                    </Tippy>
                    <Tippy content={staff.email}>
                      <td className="max-w-[150px] cursor-default overflow-hidden text-ellipsis">
                        {staff.email}
                      </td>
                    </Tippy>
                    <td className="">{staff.role}</td>
                    <td className="flex w-[100px] flex-col gap-1 text-sm">
                      <button
                        onClick={() => {
                          setInitialValues({
                            ...staff,
                          });
                        }}
                        className=" rounded border border-white/30 bg-[#8EABF2] text-white duration-200 hover:bg-blue-400 dark:bg-black/30 dark:text-white/60"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          handleDelete(staff._id);
                          toast("Successfully Deleted!", {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: isDark ? "dark" : "light",
                          });
                        }}
                        className=" rounded border border-white/30 bg-[#F28E8E] text-white duration-200 hover:bg-red-400 dark:bg-black/30 dark:text-white/60"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex h-full w-full flex-col gap-5 rounded-md bg-white p-5 dark:bg-black/50">
          <h1 className="rounded-md bg-[#8EABF2] p-2 text-center text-white dark:bg-black/30 ">
            Add Staffs
          </h1>
          <ToastContainer />
          {/* {errorMessage ? (
            <h1 className="rounded-md bg-red-300 p-5 text-center text-sm text-red-800">
              {errorMessage}
            </h1>
          ) : null} */}
          <div className="">{Stepper[index]}</div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
