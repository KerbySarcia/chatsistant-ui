import { Dialog, Transition } from "@headlessui/react";
import { Icon } from "@iconify/react";
import React, { Fragment } from "react";

const AboutUsModal = ({ isOpen, setIsOpen }) => {
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
          <Dialog.Panel className="m-4 flex w-full max-w-[400px] flex-col gap-4 rounded-xl bg-white p-5 text-gray-500 dark:bg-[#2D354B] dark:text-white">
            <Dialog.Title
              className={
                "font-productSansBlack text-center text-xl text-gray-500/80 dark:text-white  "
              }
            >
              About Us
            </Dialog.Title>
            <div className=" flex items-center gap-2 rounded-md border border-gray-500 p-2 dark:border-white/20 ">
              <Icon icon={"tabler:user-filled"} className="text-3xl" />
              <div className="flex flex-col">
                <span>Jose Gabriel R. Castillo</span>
                <span className="text-xs italic text-gray-500/80 dark:text-white/60">
                  Lead Researcher
                </span>
              </div>
            </div>
            <div className=" flex items-center gap-2 rounded-md border border-gray-500 p-2 dark:border-white/20 ">
              <Icon icon={"tabler:user-filled"} className="text-3xl" />
              <div className="flex flex-col">
                <span>Kerby Mathew O. Sarcia</span>
                <span className="text-xs italic text-gray-500/80 dark:text-white/60">
                  Lead Developer
                </span>
              </div>
            </div>
            <div className=" flex items-center gap-2 rounded-md border border-gray-500 p-2 dark:border-white/20 ">
              <Icon icon={"tabler:user-filled"} className="text-3xl" />
              <div className="flex flex-col">
                <span>Aljon S. Santos</span>
                <span className="text-xs italic text-gray-500/80 dark:text-white/60">
                  Researcher / Developer
                </span>
              </div>
            </div>
            <div className=" flex items-center gap-2 rounded-md border border-gray-500 p-2 dark:border-white/20 ">
              <Icon icon={"tabler:user-filled"} className="text-3xl" />
              <div className="flex flex-col">
                <span>Randylin B. Bernardo</span>
                <span className="text-xs italic text-gray-500/80 dark:text-white/60">
                  Researcher
                </span>
              </div>
            </div>
            <div className=" flex items-center gap-2 rounded-md border border-gray-500 p-2 dark:border-white/20 ">
              <Icon icon={"tabler:user-filled"} className="text-3xl" />
              <div className="flex flex-col">
                <span>John Eric V. Manalo</span>
                <span className="text-xs italic text-gray-500/80 dark:text-white/60">
                  Researcher
                </span>
              </div>
            </div>
            <div className=" flex items-center gap-2 rounded-md border border-gray-500 p-2 dark:border-white/20 ">
              <Icon icon={"tabler:user-filled"} className="text-3xl" />
              <div className="flex flex-col">
                <span>Michael Joshua M. Balagtas</span>
                <span className="text-xs italic text-gray-500/80 dark:text-white/60">
                  Researcher
                </span>
              </div>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default AboutUsModal;
