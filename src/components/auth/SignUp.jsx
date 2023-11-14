/* eslint-disable react/prop-types */
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import useAuthService from "../../services/useAuthService";
import useSession from "../../hooks/useSession";
import { Field, Form, Formik } from "formik";
import signUpSchema from "../../validation/signUpSchema";
import { isEmpty } from "lodash";
import LoadingSpinner from "../../components/LoadingSpinner";

const SignUp = ({ isOpen, setIsOpen }) => {
  const signUpInitialValues = {
    password: "",
    first_name: "",
    last_name: "",
    email: "",
  };
  const [signUpError, setSignUpError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { singUp } = useAuthService();
  const { signIn } = useSession();

  const handleSubmit = async data => {
    const { error } = await singUp(data);
    setIsLoading(true);

    if (!isEmpty(error)) {
      setSignUpError(error);
      setIsLoading(false);
      return;
    }

    await signIn({
      email: data.email,
      password: data.password,
    });

    setIsLoading(false);
  };

  return (
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
            <Dialog.Title className="font-productSansBlack text-center font-bold text-black dark:text-white">
              Create Account
            </Dialog.Title>
            {signUpError && (
              <span className="w-full border border-red-700 bg-red-200 p-1 text-center text-sm text-red-700">
                {signUpError}
              </span>
            )}
            <Formik
              initialValues={signUpInitialValues}
              validationSchema={signUpSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="flex flex-col gap-5">
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
                    <Field
                      className="w-full rounded border p-2 focus:outline-blue-500"
                      type="password"
                      id="password"
                      name="password"
                      autoComplete="off"
                      placeholder="Password"
                    />
                    {errors.password && touched.password ? (
                      <span className="text-xs italic text-red-400">
                        {errors.password}
                      </span>
                    ) : null}
                  </div>
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="font-productSansBlack flex justify-center rounded bg-blue-500 p-2 text-white"
                  >
                    {isLoading ? <LoadingSpinner /> : <span>Sign Up</span>}
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

export default SignUp;
