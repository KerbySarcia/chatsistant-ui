import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import useWizrd from "../../../hooks/useWizrd";
import { Form, Formik } from "formik";
import TextAreaFormik from "../forms/formik/TextAreaFormik";
import * as YUP from "yup";
import DropdownFormik from "../forms/DropdownFormik";
import useInquiryService from "../../../services/useInquiryService";
import useDarkMode from "../../../hooks/useDarkMode";
import useUserService from "../../../services/useUserService";
import random from "random-string-generator";
import LoadingSpinner from "../../LoadingSpinner";
import useAuthService from "../../../services/useAuthService";

const StepOneValidation = YUP.object().shape({
  first_name: YUP.string().required("First Name is Required"),
  last_name: YUP.string().required("Last Name is Required"),
  email: YUP.string().email("Invalid Email").required("Email is Required"),
  role: YUP.string().required("Role is Required"),
  password: YUP.string()
    .min(8, "Minimum 8 Characters")
    .required("Password is Required"),
});

const StepTwoValidation = YUP.object().shape({
  code: YUP.string().required("Code is Required"),
});

const AddUserModal = ({ isOpen, closeModal, setStaffs, staffs }) => {
  const [emailCode, setEmailCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const authService = useAuthService();
  const [userPayload, setUserPayload] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "STAFF",
    password: "",
  });

  const { handleToggle, isDark } = useDarkMode();
  const { index, next, prev, goto } = useWizrd(2);
  const userService = useUserService();
  const inquiryService = useInquiryService();

  const steps = [
    <Formik
      enableReinitialize
      initialValues={userPayload}
      validationSchema={StepOneValidation}
      onSubmit={async (data, { resetForm }) => {
        setIsLoading(true);
        try {
          const checkEmail = await userService.emailCheck({
            email: data.email,
          });
          if (checkEmail?.error) {
            setErrorMessage(checkEmail.error);
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
          setUserPayload(data);
          if (sendEmail?.data?.error?.message) {
            setErrorMessage("Something went wrong");
            return;
          }
          setEmailCode(generateOtp);
        } catch (err) {
        } finally {
          setIsLoading(false);
        }
        if (errorMessage) {
          setErrorMessage(null);
        }
        resetForm({});
        next();
      }}
    >
      {() => (
        <>
          <Form className="flex flex-col gap-4">
            <TextAreaFormik label={"First Name"} name={"first_name"} />
            <TextAreaFormik label={"Last Name"} name={"last_name"} />
            <TextAreaFormik label={"Email"} name={"email"} />
            <DropdownFormik
              label={"Role"}
              name={"role"}
              options={["STAFF", "ADMIN"]}
            />
            <TextAreaFormik label={"Password"} name={"password"} />
            <button
              disabled={isLoading}
              type="submit"
              className=" dark:bg-[#4A5168]/ flex items-center justify-center rounded-md bg-blue-300 p-3 font-bold text-white duration-200 hover:opacity-50 dark:bg-white/30"
            >
              {isLoading ? <LoadingSpinner /> : "Next"}
            </button>
          </Form>
        </>
      )}
    </Formik>,
    <Formik
      enableReinitialize
      initialValues={{
        code: "",
      }}
      validationSchema={StepTwoValidation}
      onSubmit={async (data, { resetForm }) => {
        if (data.code !== emailCode) {
          setErrorMessage("Invalid Code");
          return;
        }

        setIsLoading(true);
        try {
          const newStaff = await authService.singUp(userPayload);
          setStaffs([newStaff.data, ...staffs]);
          goto(0);
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
        } catch (error) {
        } finally {
          setIsLoading(false);
        }
        resetForm({});
        closeModal();
      }}
    >
      {() => (
        <Form className="flex flex-col gap-4">
          <TextAreaFormik label={"Email Confirmation"} name={"code"} />
          <button
            disabled={isLoading}
            type="submit"
            className=" dark:bg-[#4A5168]/ flex items-center justify-center rounded-md bg-blue-300 p-3 text-xs font-bold text-white duration-200 hover:opacity-50 dark:bg-white/30 lg:text-base"
          >
            {isLoading ? <LoadingSpinner /> : "Confirm"}
          </button>
        </Form>
      )}
    </Formik>,
  ];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="flex w-full max-w-md transform flex-col overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-[#272A3A]">
                {errorMessage ? (
                  <span className="w-full text-center text-xs capitalize text-red-300">
                    {errorMessage}
                  </span>
                ) : null}
                {steps[index]}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddUserModal;
