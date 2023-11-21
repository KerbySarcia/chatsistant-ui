/* eslint-disable react/prop-types */
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import useAuthService from "../../services/useAuthService";
import useSession from "../../hooks/useSession";
import { Field, Form, Formik } from "formik";
import signUpSchema from "../../validation/signUpSchema";
import { isEmpty } from "lodash";
import LoadingSpinner from "../../components/LoadingSpinner";
import useWizrd from "../../hooks/useWizrd";
import useUserService from "../../services/useUserService";
import * as Yup from "yup";
import random from "random-string-generator";
import { ToastContainer, toast } from "react-toastify";
import useDarkMode from "../../hooks/useDarkMode";
import useInquiryService from "../../services/useInquiryService";
import { Icon } from "@iconify/react";

const StepTwo = ({ holdOtp, credentials }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { singUp } = useAuthService();
  const { signIn } = useSession();

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
          const { error } = await singUp(credentials);
          setIsLoading(true);
          if (!isEmpty(error)) {
            setSignUpError(error);
            setIsLoading(false);
            return;
          }
          await signIn({
            email: credentials.email,
            password: credentials.password,
          });
          setIsLoading(false);
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
              disabled={isLoading}
            />
            {errors.code && touched.code ? (
              <span className="text-xs italic text-red-400">{errors.code}</span>
            ) : null}
          </div>
          <button
            disabled={isLoading}
            type="submit"
            className="flex items-center justify-center rounded bg-blue-500 p-2 font-productSansBlack text-white duration-200 hover:opacity-50"
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

const StepOne = ({ next, setCredentials, setHoldOtp }) => {
  const [isLoading, setIsLoading] = useState(false);
  const inquiryService = useInquiryService();
  const [signUpError, setSignUpError] = useState(null);
  const { isDark } = useDarkMode();
  const [isHide, setIsHide] = useState(true);
  const [isHideConfirmPassword, setIsHideConfirmPassword] = useState(true);
  const userService = useUserService();
  return (
    <Formik
      initialValues={{
        password: "",
        confirm_password: "",
        first_name: "",
        last_name: "",
        email: "",
      }}
      validationSchema={signUpSchema}
      onSubmit={async data => {
        setIsLoading(true);
        try {
          const isValid = await userService.emailCheck({ email: data.email });
          if (isValid?.error) {
            return setSignUpError("Email Already Exist");
          }
          const generateOtp = random(8);

          const sendEmail = await inquiryService.sendEmail({
            to: data.email,
            from: "chatsistant@gmail.com",
            subject: "Addmission",
            emailVerify: true,
            code: generateOtp,
          });

          setHoldOtp(generateOtp);
          setCredentials(data);
          next();
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
        <Form className="flex flex-col gap-5">
          {signUpError && (
            <span className="w-full border border-red-700 bg-red-200 p-1 text-center text-sm text-red-700">
              {signUpError}
            </span>
          )}
          <div className="flex flex-col gap-1">
            <Field
              className="w-full rounded border p-2 focus:outline-blue-500"
              id="first_name"
              name="first_name"
              placeholder="First Name"
              autoComplete="off"
            />
            {errors.first_name && touched.first_name ? (
              <span className="text-xs italic text-red-400">
                {errors.first_name}
              </span>
            ) : null}
          </div>
          <div className="flex flex-col gap-1">
            <Field
              className="w-full rounded border p-2 focus:outline-blue-500"
              id="last_name"
              name="last_name"
              placeholder="Last Name"
              autoComplete="off"
            />
            {errors.last_name && touched.last_name ? (
              <span className="text-xs italic text-red-400">
                {errors.last_name}
              </span>
            ) : null}
          </div>
          <div className="flex flex-col gap-1">
            <Field
              className="w-full rounded border p-2 focus:outline-blue-500"
              id="email"
              name="email"
              placeholder="Email"
              autoComplete="off"
            />
            {errors.email && touched.email ? (
              <span className="text-xs italic text-red-400">
                {errors.email}
              </span>
            ) : null}
          </div>
          <div className="flex flex-col gap-1">
            <div className="relative flex items-center justify-end">
              <Field
                className="w-full rounded border p-2 pr-8 focus:outline-blue-500"
                type={isHide ? "password" : "text"}
                id="password"
                name="password"
                autoComplete="off"
                disabled={isLoading}
                placeholder="Password"
              />
              <Icon
                icon={isHide ? "solar:eye-bold" : "mingcute:eye-close-fill"}
                onClick={() => setIsHide(prev => !prev)}
                className="absolute mr-3 cursor-pointer text-lg"
              />
            </div>
            {errors.password && touched.password ? (
              <span className="text-xs italic text-red-400">
                {errors.password}
              </span>
            ) : null}
          </div>
          <div className="flex flex-col gap-1">
            <div className="relative flex items-center justify-end">
              <Field
                className="w-full rounded border p-2 pr-8 focus:outline-blue-500"
                type={isHideConfirmPassword ? "password" : "text"}
                id="confirm_password"
                name="confirm_password"
                autoComplete="off"
                placeholder="Confirm Password"
                disabled={isLoading}
              />
              <Icon
                icon={
                  isHideConfirmPassword
                    ? "solar:eye-bold"
                    : "mingcute:eye-close-fill"
                }
                onClick={() => setIsHideConfirmPassword(prev => !prev)}
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
            disabled={isLoading}
            type="submit"
            className="flex justify-center rounded bg-blue-500 p-2 font-productSansBlack text-white"
          >
            {isLoading ? <LoadingSpinner /> : <span>Sign Up</span>}
          </button>
        </Form>
      )}
    </Formik>
  );
};

const SignUp = ({ isOpen, setIsOpen }) => {
  const [credentials, setCredentials] = useState(null);
  const [holdOtp, setHoldOtp] = useState(null);

  const { index, next } = useWizrd(1);
  const render = [
    <StepOne
      next={next}
      setCredentials={setCredentials}
      setHoldOtp={setHoldOtp}
    />,
    <StepTwo credentials={credentials} holdOtp={holdOtp} />,
  ];
  return (
    <>
      <ToastContainer />
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          className=" absolute top-0 z-50 flex h-full w-full items-center justify-center"
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
            if (signUpError) {
              setSignUpError(null);
            }
          }}
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
            <div className="fixed inset-0  bg-black/30 backdrop-blur-sm" />
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
            <Dialog.Panel className="m-5 flex w-full max-w-[400px] flex-col gap-4 rounded-md bg-white p-4 dark:bg-[#2D354B]">
              <Dialog.Title className="text-center font-productSansBlack font-bold text-black dark:text-white">
                Create Account
              </Dialog.Title>

              {render[index]}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

export default SignUp;
