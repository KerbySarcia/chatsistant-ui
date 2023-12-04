import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import LOGO from "../../assets/logo.svg";
import BRAIN from "../../assets/Group.svg";
import QUERY from "../../assets/Group (1).svg";
import SETTINGS from "../../assets/Group (2).svg";
import LOGOUT from "../../assets/Group (3).svg";
import useSession from "../../hooks/useSession";
import { Icon } from "@iconify/react";

const MenuModal = ({ closeModal, isOpen, navigateTo }) => {
  const { signOut, session } = useSession();

  const MENU_NAVIGATIONS = [
    { value: "home", icon: LOGO, title: "Home" },
    { value: "knowledge-feeder", icon: BRAIN, title: "Knowledge Feeder" },
    {
      value: "redirected-inquiries",
      icon: QUERY,
      title: "Redirected Inquiries",
    },
    session?.role === "ADMIN" && {
      value: "account-settings",
      icon: SETTINGS,
      title: "Account Settings",
    },
  ];

  const menuNavigations = MENU_NAVIGATIONS.map((value, key) => (
    <div
      key={key}
      onClick={() => {
        navigateTo(value.value);
        closeModal();
      }}
      className="flex items-center gap-5"
    >
      <img
        src={value.icon}
        alt={value.title}
        className="h-16 w-16 rounded-full bg-white object-contain object-center p-1"
      />
      <h1 className="text-xl">{value.title}</h1>
    </div>
  ));

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="-translate-x-0"
          enterTo="translate-x-0"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 backdrop-blur-lg backdrop-brightness-50" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300 translate-x"
              enterFrom="opacity-0 -translate-x-10"
              enterTo="opacity-100 translate-x-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="flex flex-col gap-5 font-productSansBlack text-white/80">
                {menuNavigations}
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-5"
                >
                  <img
                    src={LOGOUT}
                    alt="logout"
                    className="h-16 w-16 rounded-full bg-white object-contain object-center p-1"
                  />
                  <span className="text-xl">Logout</span>
                </button>
                <div className="flex w-full justify-center">
                  <Icon
                    onClick={closeModal}
                    icon={"ph:x-bold"}
                    className="h-8 w-8 rounded-full bg-white text-black"
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default MenuModal;
