import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import useSession from "../../hooks/useSession";
import { Field, Form, Formik } from "formik";
import signInSchema from "../../validation/signInSchema";
import Lottie from "lottie-react";
import LoginAnimation from "../../assets/lottie/animation_lnkidi4p.json";

// eslint-disable-next-line react/prop-types
const Login = ({ isOpen, setIsOpen }) => {
  const loginInitialValues = {
    email: "",
    password: "",
  };
  const [loginError, setLoginError] = useState(null);
  const { signIn } = useSession();

  const handleSubmit = async (data) => {
    const { error } = await signIn(data);
    console.log(error);
    if (error) setLoginError(error);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        className=" w-full h-full absolute top-0 z-50 flex justify-center items-center"
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
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30" />
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
          <Dialog.Panel className="bg-[#2D354B] rounded-xl p-4 flex max-w-[400px] w-full m-4 flex-col gap-4">
            <Dialog.Title className="flex justify-center font-bold w-full">
              <Lottie animationData={LoginAnimation} className="h-48 w-48" />
            </Dialog.Title>
            {loginError && (
              <span className="p-1 w-full bg-red-200 border text-red-700 text-sm text-center border-red-700">
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
                    type="submit"
                    className="bg-blue-500 rounded text-white p-1 font-productSansBlack"
                  >
                    Sign In
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
