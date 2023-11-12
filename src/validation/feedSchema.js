import * as Yup from "yup";

export default Yup.object().shape({
  target: Yup.string()
    .min(4, "Too short")
    .max(25, "Too long")
    .required("Target is required"),
  subject: Yup.string()
    .min(4, "Too short")
    .max(25, "Too long")
    .required("Subject is required"),
  information: Yup.string().min(25, "Too short").required("Value is required"),
});
