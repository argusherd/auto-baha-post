import app from "./index";

const server = app.listen(process.env.API_PORT || 48763);

export default server;
