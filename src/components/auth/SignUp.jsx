/* eslint-disable react/prop-types */
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import useAuthService from "../../services/useAuthService";
import useSession from "../../hooks/useSession";
import { Field, Form, Formik } from "formik";
import signUpSchema from "../../validation/signUpSchema";
import { isEmpty } from "lodash";
import Lottie from "lottie-react";
import LoadingAnimation from "../../assets/lottie/animation_lnkk9t58.json";

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

  const handleSubmit = async (data) => {
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
        className=" w-full h-full absolute top-0 z-50 flex justify-center items-center"
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
          <div className="fixed inset-0  backdrop-blur-sm bg-black/30" />
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
          <Dialog.Panel className="bg-[#2D354B] m-5 rounded-md p-4 max-w-[400px] w-full flex flex-col gap-4">
            <Dialog.Title className="text-center text-white font-bold font-productSansBlack">
              Create Account
            </Dialog.Title>
            {signUpError && (
              <span className="p-1 w-full bg-red-200 border text-red-700 text-sm text-center border-red-700">
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
                      className="w-full p-1 border rounded focus:outline-blue-500"
                      id="first_name"
                      name="first_name"
                      placeholder="First Name"
                      autoComplete="off"
                    />
                    {errors.first_name && touched.first_name ? (
                      <span className="text-red-500 text-xs italic">
                        {errors.first_name}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Field
                      className="w-full p-1 border rounded focus:outline-blue-500"
                      id="last_name"
                      name="last_name"
                      placeholder="Last Name"
                      autoComplete="off"
                    />
                    {errors.last_name && touched.last_name ? (
                      <span className="text-red-500 text-xs italic">
                        {errors.last_name}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Field
                      className="w-full p-1 border rounded focus:outline-blue-500"
                      id="email"
                      name="email"
                      placeholder="Email"
                      autoComplete="off"
                    />
                    {errors.email && touched.email ? (
                      <span className="text-red-500 text-xs italic">
                        {errors.email}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Field
                      className="w-full p-1 border rounded focus:outline-blue-500"
                      type="password"
                      id="password"
                      name="password"
                      autoComplete="off"
                      placeholder="Password"
                    />
                    {errors.password && touched.password ? (
                      <span className="text-red-500 text-xs italic">
                        {errors.password}
                      </span>
                    ) : null}
                  </div>
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="bg-blue-500 rounded text-white p-1 font-productSansBlack flex justify-center"
                  >
                    {isLoading ? (
                      <Lottie
                        animationData={LoadingAnimation}
                        className="h-10 w-10 p-0"
                      />
                    ) : (
                      <span>Sign Up</span>
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

export default SignUp;
