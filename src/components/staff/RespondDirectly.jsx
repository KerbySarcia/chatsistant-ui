import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useContext, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import { Field, Form, Formik } from "formik";
import clsx from "clsx";
import useInquiryService from "../../services/useInquiryService";
import { InquiriesContext } from "../../pages/Staff/pages/RedirectedInquiries";
import * as Yup from "yup";

const respondDirectlySchema = Yup.object().shape({
  user: Yup.string().required(),
  answer: Yup.string().min(5, "Too short").required("Answer is required"),
});

const RespondDirectly = ({ isOpen, setIsOpen, question, user, id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null);
  const initialValues = {
    user: user,
    answer: "",
  };
  const inquiryService = useInquiryService();
  const { inquiries, setInquiries } = useContext(InquiriesContext);

  const handleSubmit = async data => {
    try {
      setIsLoading(true);
      const response = await inquiryService.sendEmail({
        to: user,
        from: "chatsistant@gmail.com",
        subject: "Addmission",
        question: question,
        answer: data.answer,
      });
      await inquiryService.updateStatus(id, {
        status: "DONE",
        answer: data.answer,
      });
      setInquiries([
        ...inquiries.map(inquiry =>
          inquiry._id === id
            ? { ...inquiry, status: "DONE", answer: data.answer }
            : inquiry
        ),
      ]);
    } catch (error) {
      console.error(error);
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
          <Dialog.Panel className="m-4 flex max-h-[700px] w-full max-w-[400px] flex-col gap-4 rounded-xl bg-white p-5 text-black/60 dark:bg-[#2D354B] dark:text-white">
            <Dialog.Title className={"flex flex-col gap-1"}>
              <span className="text-lg text-black/60 dark:text-white">
                Question
              </span>
              <span className="text-black/60 dark:text-white">{question}</span>
            </Dialog.Title>
            <Formik
              validationSchema={respondDirectlySchema}
              onSubmit={handleSubmit}
              initialValues={initialValues}
            >
              {({ errors, touched }) => (
                <Form className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="subject "
                      className="text-black/60 dark:text-white"
                    >
                      To
                    </label>
                    <Field
                      className="rounded-md border-2 border-white/20 bg-[#E8E8E8] p-2 text-black/60 duration-200 focus:outline-[#323745] dark:bg-[#4A5168] dark:text-white"
                      id="user"
                      name="user"
                      disabled={true}
                      value={user}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="Answer"
                      className="text-black/60 dark:text-white"
                    >
                      Answer
                    </label>
                    <Field
                      as="textarea"
                      className="h-full w-full resize-none rounded-md border-2 border-white/20 bg-[#E8E8E8] p-2 duration-200 focus:outline-[#323745] dark:bg-[#4A5168]"
                      id="answer"
                      name="answer"
                    />
                    {errors.answer && touched.answer ? (
                      <div className="text-xs text-red-400">
                        {errors.answer}
                      </div>
                    ) : null}
                  </div>
                  <button
                    disabled={isLoading || isSuccess}
                    type="submit"
                    className={clsx(
                      isSuccess ? "bg-green-400" : "bg-blue-500",
                      "flex  items-center justify-center rounded-md p-3 text-white"
                    )}
                  >
                    {isLoading ? (
                      <LoadingSpinner />
                    ) : isSuccess === true ? (
                      "Done"
                    ) : (
                      "Send Email"
                    )}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center  rounded-md bg-gray-300 p-3 text-black/60 dark:bg-[#4A5168] dark:text-white"
                  >
                    Close
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

export default RespondDirectly;
