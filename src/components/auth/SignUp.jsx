/* eslint-disable react/prop-types */
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import useAuthService from "../../services/useAuthService";
import useSession from "../../hooks/useSession";

const SignUp = ({ isOpen, setIsOpen }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  });
  const [loginError, setLoginError] = useState(null);
  const { singUp } = useAuthService();
  const { signIn } = useSession();

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  };
  console.log(loginError);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await singUp(formData);
      await signIn({
        username: formData.username,
        password: formData.password,
      });
    } catch (error) {
      console.log("sign up => ", error.response);
      setLoginError(error.response.data);
    }
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
          <div className="fixed inset-0 bg-black/30" />
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
          <Dialog.Panel className="bg-white w-fit border rounded-md p-4 min-w-[400px] flex flex-col gap-4">
            <Dialog.Title className="text-center font-bold">
              Create Account
            </Dialog.Title>
            <form
              onSubmit={handleSubmit}
              id="sign-up-form"
              className="flex flex-col gap-3"
            >
              <input
                name="phone_number"
                onChange={handleChange}
                type="text"
                className="border p-1 rounded-md"
                placeholder="Phone Number"
              />
              <input
                name="first_name"
                onChange={handleChange}
                type="text"
                className="border p-1 rounded-md"
                placeholder="First Name"
              />
              <input
                name="last_name"
                onChange={handleChange}
                type="text"
                className="border p-1 rounded-md"
                placeholder="Last Name"
              />
              <input
                name="username"
                onChange={handleChange}
                type="text"
                className="border p-1 rounded-md"
                placeholder="username"
              />
              <input
                name="password"
                onChange={handleChange}
                type="password"
                className="border p-1 rounded-md"
                placeholder="password"
              />
              <button
                form="sign-up-form"
                type="submit"
                className="bg-blue-500 text-white p-1 rounded"
              >
                Sign up
              </button>
            </form>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default SignUp;
