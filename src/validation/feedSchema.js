import * as Yup from "yup";

export default Yup.object().shape({
  target: Yup.string().required("Target is required"),
  subject: Yup.string().required("Subject is required"),
  value: Yup.string().required("Value is required"),
});
