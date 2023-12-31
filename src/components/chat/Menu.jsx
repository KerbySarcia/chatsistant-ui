import { Dialog, Transition } from "@headlessui/react";
import { Icon } from "@iconify/react";
import React, { Fragment } from "react";
import LOGO from "../../assets/images/dhvsu-logo.png";
import { useNavigate } from "react-router-dom";

const Menu = ({
  isOpen,
  setIsOpen,
  id,
  setMessageLoading,
  updateConversationHistory,
  setConversations,
  signOut,
  conversations,
}) => {
  const nav = useNavigate();
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        className=" absolute top-0 z-50 flex h-full w-full items-center justify-center"
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
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
          <Dialog.Panel className="m-5 flex w-full max-w-[400px] flex-col gap-4 rounded-md bg-white/90 p-4 dark:bg-[#2D354B]">
            <Dialog.Title className="text-center font-productSansBlack font-bold text-black dark:text-white">
              Menu
            </Dialog.Title>
            <div className="flex w-full flex-col gap-3">
              <a
                href="https://www.facebook.com/dhvsuofficeofadmissions"
                target="_blank"
                rel="noreferrer"
              >
                <button className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-500 p-4 text-white">
                  <Icon icon={"bi:facebook"} className="text-xl" />
                  <span className="font-productSansBlack text-white">
                    Facebook Admission
                  </span>
                </button>
              </a>
              <a href="https://dhvsu.edu.ph/" target="_blank" rel="noreferrer">
                <button className="flex w-full items-center justify-center gap-2 rounded-md bg-[#a6304d] p-4">
                  <img
                    src={LOGO}
                    alt="logo"
                    className="h-5 w-5 object-cover object-center"
                  />
                  <span className="font-productSansBlack text-white">
                    DHVSU Website
                  </span>
                </button>
              </a>
              {conversations?.length > 0 ? (
                <button
                  onClick={async () => {
                    setMessageLoading(true);
                    await updateConversationHistory(id, {
                      conversation_history: [],
                    });
                    setConversations([]);
                    setMessageLoading(false);
                  }}
                  className="w-full rounded-md bg-white/50 p-4 text-[#9A94D9] shadow duration-200 hover:bg-red-700/50 hover:text-white dark:bg-white"
                >
                  Clear Conversation
                </button>
              ) : null}
              {id ? (
                <button
                  onClick={() => signOut()}
                  className="w-full rounded-md bg-white/50 p-4 text-[#9A94D9] shadow duration-200 hover:opacity-50 dark:bg-white "
                >
                  Sign out
                </button>
              ) : (
                <button
                  onClick={() => nav("/")}
                  className="w-full rounded-md bg-white/50 p-4 text-[#9A94D9] shadow duration-200 hover:opacity-50 dark:bg-white "
                >
                  Back
                </button>
              )}
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default Menu;
