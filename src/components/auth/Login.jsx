import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import useSession from "../../hooks/useSession";
import { Field, Form, Formik } from "formik";
import signInSchema from "../../validation/signInSchema";
import Lottie from "lottie-react";
import LoginAnimation from "../../assets/lottie/animation_lnkidi4p.json";
import LoadingSpinner from "../LoadingSpinner";

// eslint-disable-next-line react/prop-types
const Login = ({ isOpen, setIsOpen }) => {
  const loginInitialValues = {
    email: "",
    password: "",
  };
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
        className=" absolute top-0 z-50 flex h-full w-full items-center justify-center"
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
          <Dialog.Panel className="m-4 flex w-full max-w-[400px] flex-col gap-4 rounded-xl bg-[#2D354B] p-5">
            <Dialog.Title className="flex w-full justify-center font-bold">
              <Lottie animationData={LoginAnimation} className="h-48 w-48" />
            </Dialog.Title>
            {loginError && (
              <span className="w-full border border-red-700 bg-red-200 p-1 text-center text-sm text-red-700">
                {loginError}
              </span>
            )}
            <Formik
              initialValues={loginInitialValues}
              validationSchema={signInSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1">
                    <Field
                      className="w-full rounded border p-1 px-2 focus:outline-blue-500"
                      id="email"
                      name="email"
                      placeholder="Email"
                      autoComplete="off"
                      disabled={isLoading}
                    />
                    {errors.email && touched.email ? (
                      <span className="text-xs italic text-red-500">
                        {errors.email}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Field
                      className="w-full rounded border p-1 px-2 focus:outline-blue-500"
                      type="password"
                      id="password"
                      name="password"
                      autoComplete="off"
                      placeholder="Password"
                      disabled={isLoading}
                    />
                    {errors.password && touched.password ? (
                      <span className="text-xs italic text-red-500">
                        {errors.password}
                      </span>
                    ) : null}
                  </div>
                  <button
                    type="submit"
                    className="flex items-center justify-center rounded bg-blue-500 p-1 font-productSansBlack text-white"
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
