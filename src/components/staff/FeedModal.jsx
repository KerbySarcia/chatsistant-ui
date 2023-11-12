import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Field, Form, Formik } from "formik";
import React, { Fragment, useContext, useState } from "react";
import feedSchema from "../../validation/feedSchema";
import useInquiryService from "../../services/useInquiryService";
import useKnowledege from "../../services/useKnowledge";
import LoadingSpinner from "../../components/LoadingSpinner";
import { InquiriesContext } from "../../pages/Staff/pages/RedirectedInquiries";

const FeedModal = ({ isOpen, setIsOpen, question, id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null);
  const initialValues = {
    subject: "",
    target: "",
    information: "",
  };
  const { inquiries, setInquiries } = useContext(InquiriesContext);
  const inquiryService = useInquiryService();
  const knowledgeService = useKnowledege();

  const handleSubmit = async data => {
    try {
      setIsLoading(true);
      await knowledgeService.addKnowledge({
        ...data,
        information: `${data.subject} ${data.target} ${data.information}`,
      });
      await inquiryService.updateStatus(id, {
        status: "DONE",
        answer: data.information,
      });
      setInquiries([
        ...inquiries.map(inquiry =>
          inquiry._id === id
            ? { ...inquiry, status: "DONE", answer: data.information }
            : inquiry
        ),
      ]);
      setIsSuccess(true);
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
          <Dialog.Panel className="m-4 flex max-h-[700px] w-full max-w-[400px] flex-col gap-4 rounded-xl bg-[#2D354B] p-5 text-white">
            <Dialog.Title className={"flex flex-col gap-1"}>
              <span className="text-lg">Question</span>
              <span>{question}</span>
            </Dialog.Title>
            <Formik
              onSubmit={handleSubmit}
              initialValues={initialValues}
              validationSchema={feedSchema}
            >
              {({ errors, touched }) => (
                <Form className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="subject">Subject</label>
                    <Field
                      className="rounded-md border-2 border-white/20 bg-[#4A5168] p-2 duration-200 focus:outline-[#323745]"
                      id="subject"
                      name="subject"
                      disabled={isLoading || isSuccess}
                    />
                    {errors.subject && touched.subject ? (
                      <div className="text-xs text-red-400">
                        {errors.subject}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="target">Target</label>
                    <Field
                      className="rounded-md border-2 border-white/20 bg-[#4A5168] p-2 duration-200 focus:outline-[#323745]"
                      id="target"
                      name="target"
                      disabled={isLoading || isSuccess}
                    />
                    {errors.target && touched.target ? (
                      <div className="text-xs text-red-400">
                        {errors.target}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="information">Value</label>
                    <Field
                      as="textarea"
                      className="h-full w-full resize-none rounded-md border-2 border-white/20 bg-[#4A5168] p-2 duration-200 focus:outline-[#323745]"
                      id="information"
                      name="information"
                      disabled={isLoading || isSuccess}
                    />
                    {errors.information && touched.information ? (
                      <div className="text-xs text-red-400">
                        {errors.information}
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
                      "Feed"
                    )}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center  rounded-md bg-[#4A5168] p-3 text-white"
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

export default FeedModal;
