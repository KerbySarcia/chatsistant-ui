const ROOT_PATHS = {
  ROOT: "/",
};

const PATHS = {
  LANDING_PAGE: `${ROOT_PATHS.ROOT}`,
  CHAT_PAGE: (id = ":id") => `${ROOT_PATHS.ROOT}/chat/${id}`,
  STAFF_PAGE: `${ROOT_PATHS.ROOT}/staff`,
};

export default PATHS;
