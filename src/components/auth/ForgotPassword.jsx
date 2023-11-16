import { Dialog, Transition } from "@headlessui/react";
import { Field, Formik, Form } from "formik";
import React, { Fragment, useState } from "react";
import * as Yup from "yup";
import LoadingSpinner from "../LoadingSpinner";
import useInquiryService from "../../services/useInquiryService";
import random from "random-string-generator";
import useWizrd from "../../hooks/useWizrd";
import useUserService from "../../services/useUserService";
import useDarkMode from "../../hooks/useDarkMode";
import { Icon } from "@iconify/react";

const emailValidation = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("email is required"),
});

const StepOne = ({ next, setHoldOtp, setEmail, toast }) => {
  const [isLoading, setIsLoading] = useState(false);
  const inquiryService = useInquiryService();
  const [errorMessage, setErrorMessage] = useState(null);
  const { isDark } = useDarkMode();

  return (
    <Formik
      enableReinitialize
      initialValues={{
        email: "",
      }}
      validationSchema={emailValidation}
      onSubmit={async data => {
        setIsLoading(true);
        try {
          const generateOtp = random(8);
          const sendEmail = await inquiryService.sendEmail({
            to: data.email,
            from: "chatsistant@gmail.com",
            subject: "Addmission",
            forgotPassword: true,
            code: generateOtp,
          });

          if (sendEmail?.data?.error?.message) {
            console.log(sendEmail);
            setErrorMessage("User does not exist");
            return;
          }
          next();
          setHoldOtp(generateOtp);
          setEmail(data.email);
        } catch (err) {
          toast.error("Something went wrong, please try again.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: isDark ? "dark" : "light",
          });
        } finally {
          setIsLoading(false);
        }
      }}
    >
      {({ errors, touched }) => (
        <Form className="flex flex-col gap-5 ">
          {errorMessage ? (
            <div className="rounded-md border-red-900 bg-red-200 p-3 text-center text-red-900">
              {errorMessage}
            </div>
          ) : null}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-black/60 dark:text-white">
              Email
            </label>
            <Field
              className="w-full rounded border p-2  focus:outline-blue-500"
              id="email"
              name="email"
              autoComplete="off"
              disabled={isLoading}
            />
            {errors.email && touched.email ? (
              <span className="text-xs italic text-red-400">
                {errors.email}
              </span>
            ) : null}
          </div>
          <button
            disabled={isLoading}
            type="submit"
            className="font-productSansBlack flex items-center justify-center rounded bg-blue-500 p-2 text-white duration-200 hover:opacity-50"
          >
            {isLoading ? (
              <LoadingSpinner className={"!h-4 !w-4"} />
            ) : (
              "Continue"
            )}
          </button>
        </Form>
      )}
    </Formik>
  );
};

const StepTwo = ({ prev, next, holdOtp }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        code: "",
      }}
      validationSchema={Yup.object().shape({
        code: Yup.string().required("Code is required"),
      })}
      onSubmit={async (data, { resetForm }) => {
        if (holdOtp === data.code) {
          next();
        } else {
          setErrorMessage("Wrong Code.");
        }
      }}
    >
      {({ errors, touched }) => (
        <Form className="flex flex-col gap-5 ">
          {errorMessage ? (
            <div className="rounded-md border-red-900 bg-red-200 p-3 text-center text-red-900">
              {errorMessage}
            </div>
          ) : null}
          <div className="flex flex-col gap-1">
            <label htmlFor="code" className="text-black/60 dark:text-white">
              Email Verification
            </label>
            <Field
              className="w-full rounded border p-2  focus:outline-blue-500"
              id="code"
              name="code"
              autoComplete="off"
              // disabled={isLoading}
            />
            {errors.code && touched.code ? (
              <span className="text-xs italic text-red-400">{errors.code}</span>
            ) : null}
          </div>
          <button
            // disabled={isLoading}
            type="submit"
            className="font-productSansBlack flex items-center justify-center rounded bg-blue-500 p-2 text-white duration-200 hover:opacity-50"
          >
            {isLoading ? (
              <LoadingSpinner className={"!h-4 !w-4"} />
            ) : (
              "Continue"
            )}
          </button>
          <button
            // disabled={isLoading}
            onClick={() => prev()}
            className="font-productSansBlack flex items-center justify-center rounded bg-blue-500 p-2 text-white duration-200 hover:opacity-50"
          >
            Back
          </button>
        </Form>
      )}
    </Formik>
  );
};

const StepThree = ({ setIsOpen, email, setIsOpenLogin, toast }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hideNew, setHideNew] = useState(true);
  const [hideConfirm, setHideConfirm] = useState(true);
  const userService = useUserService();
  const { isDark } = useDarkMode();

  return (
    <Formik
      enableReinitialize
      initialValues={{
        new_password: "",
        confirm_password: "",
      }}
      validationSchema={Yup.object().shape({
        new_password: Yup.string()
          .min(8, "Minimum of 8 Characters")
          .required("New Password is Required"),
        confirm_password: Yup.string()
          .oneOf([Yup.ref("new_password"), null], "Password don't match!")
          .required(),
      })}
      onSubmit={async data => {
        setIsLoading(true);
        try {
          await userService.forgotPassword({
            email: email,
            password: data.new_password,
          });
          // toast.success("Successfully Changed Password!", {
          //   position: "top-right",
          //   autoClose: 5000,
          //   hideProgressBar: false,
          //   closeOnClick: true,
          //   pauseOnHover: true,
          //   draggable: true,
          //   progress: undefined,
          //   theme: isDark ? "dark" : "light",
          // });
          setIsOpen(false);
          setIsOpenLogin(true);
        } finally {
          setIsLoading(false);
        }
      }}
    >
      {({ errors, touched }) => (
        <Form className="flex flex-col gap-5 ">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="new_password"
              className="text-black/60 dark:text-white"
            >
              New Password
            </label>
            <div className="relative flex items-center justify-end">
              <Field
                className="w-full rounded border p-2 pr-8 focus:outline-blue-500"
                type={hideNew ? "password" : "text"}
                id="new_password"
                name="new_password"
                autoComplete="off"
                disabled={isLoading}
              />
              <Icon
                icon={hideNew ? "solar:eye-bold" : "mingcute:eye-close-fill"}
                onClick={() => setHideNew(prev => !prev)}
                className="absolute mr-3 cursor-pointer text-lg"
              />
            </div>
            {errors.new_password && touched.new_password ? (
              <span className="text-xs italic text-red-400">
                {errors.new_password}
              </span>
            ) : null}
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="confirm_password"
              className="text-black/60 dark:text-white"
            >
              Confirm Password
            </label>
            <div className="relative flex items-center justify-end">
              <Field
                className="w-full rounded border p-2 pr-8 focus:outline-blue-500"
                type={hideConfirm ? "password" : "text"}
                id="confirm_password"
                name="confirm_password"
                autoComplete="off"
                disabled={isLoading}
              />
              <Icon
                icon={
                  hideConfirm ? "solar:eye-bold" : "mingcute:eye-close-fill"
                }
                onClick={() => setHideConfirm(prev => !prev)}
                className="absolute mr-3 cursor-pointer text-lg"
              />
            </div>
            {errors.confirm_password && touched.confirm_password ? (
              <span className="text-xs italic text-red-400">
                {errors.confirm_password}
              </span>
            ) : null}
          </div>
          <button
            type="submit"
            className="font-productSansBlack flex items-center justify-center rounded bg-blue-500 p-2 text-white duration-200 hover:opacity-50"
          >
            {isLoading ? (
              <LoadingSpinner className={"!h-4 !w-4"} />
            ) : (
              "Continue"
            )}
          </button>
        </Form>
      )}
    </Formik>
  );
};

const ForgotPassword = ({ isOpen, setIsOpen, setIsOpenLogin, toast }) => {
  const inquiryService = useInquiryService();
  const [holdOtp, setHoldOtp] = useState(null);
  const [email, setEmail] = useState(null);

  const { index, next, prev } = useWizrd(2);

  const render = [
    <StepOne
      next={next}
      setHoldOtp={setHoldOtp}
      setEmail={setEmail}
      toast={toast}
    />,
    <StepTwo next={next} prev={prev} holdOtp={holdOtp} />,
    <StepThree
      toast={toast}
      email={email}
      setIsOpen={setIsOpen}
      setIsOpenLogin={setIsOpenLogin}
    />,
  ];

  return (
    <>
      <Transition appear show={isOpen}>
        <Dialog
          className="absolute top-0 z-50 flex h-full w-full items-center justify-center"
          open={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="m-4 flex w-full max-w-[400px] flex-col gap-4 rounded-xl bg-white p-5 dark:bg-[#2D354B]">
              <Dialog.Title className="flex w-full justify-center font-bold">
                <div className="text-black/60 dark:text-white">
                  Forgot Password
                </div>
              </Dialog.Title>
              {render[index]}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

export default ForgotPassword;
