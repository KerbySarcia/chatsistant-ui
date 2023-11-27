import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import useSession from "../../hooks/useSession";
import { Field, Form, Formik } from "formik";
import signInSchema from "../../validation/signInSchema";
import Lottie from "lottie-react";
import LoginAnimation from "../../assets/lottie/animation_lnkidi4p.json";
import LoadingSpinner from "../LoadingSpinner";
import DHVSU from "../../assets/images/dabchatlogo.png";
import { Icon } from "@iconify/react";

// eslint-disable-next-line react/prop-types
const Login = ({ isOpen, setIsOpen, setPasswordModal }) => {
  const loginInitialValues = {
    email: "",
    password: "",
  };
  const [isHide, setIsHide] = useState(true);
  const [loginError, setLoginError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useSession();

  const handleSubmit = async data => {
    setIsLoading(true);
    try {
      const { error } = await signIn(data);
      if (error) setLoginError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        className=" absolute top-0 z-10 flex h-full w-full items-center justify-center"
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
              {/* <Lottie animationData={LoginAnimation} className="h-48 w-48" /> */}
              <img
                src={DHVSU}
                alt="logo"
                className="h-48 w-48 rounded-l-[0.625rem] rounded-r-[1.563rem] object-cover object-center shadow-md"
              />
            </Dialog.Title>
            {loginError && (
              <span className="w-full border border-red-400 bg-red-200 p-1 text-center text-sm text-red-700">
                {loginError}
              </span>
            )}
            <Formik
              initialValues={loginInitialValues}
              validationSchema={signInSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="flex flex-col gap-5 ">
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="email"
                      className="text-black dark:text-white"
                    >
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
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="password"
                      className="text-black dark:text-white"
                    >
                      Password
                    </label>
                    <div className="relative flex items-center justify-end">
                      <Field
                        className="w-full rounded border p-2 pr-8 focus:outline-blue-500"
                        type={isHide ? "password" : "text"}
                        id="password"
                        name="password"
                        autoComplete="off"
                        disabled={isLoading}
                      />
                      <Icon
                        icon={
                          isHide ? "solar:eye-bold" : "mingcute:eye-close-fill"
                        }
                        onClick={() => setIsHide(prev => !prev)}
                        className="absolute mr-3 cursor-pointer text-lg"
                      />
                    </div>
                    {errors.password && touched.password ? (
                      <span className="text-xs italic text-red-400">
                        {errors.password}
                      </span>
                    ) : null}
                    <span
                      onClick={() => {
                        setIsOpen(false);
                        setPasswordModal(true);
                      }}
                      className="cursor-pointer text-xs text-black/90 dark:text-white/50"
                    >
                      Forgot Password?
                    </span>
                  </div>
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="flex items-center justify-center rounded bg-blue-500 p-2 font-productSansBlack text-white duration-200 hover:opacity-50"
                  >
                    {isLoading ? (
                      <LoadingSpinner className={"!h-4 !w-4"} />
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default Login;
