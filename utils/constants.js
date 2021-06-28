const OK_CODE = 200;
const ERR_CODE_BAD_REQ = 400;
const ERR_CODE_NOT_FOUND = 404;
const ERR_CODE_INT_SER = 404;
const MONGODB_URL = 'mongodb://localhost:27017/mestodb';
const MONGODB_OPTIONS = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}

module.exports = {
  OK_CODE,
  ERR_CODE_BAD_REQ,
  ERR_CODE_NOT_FOUND,
  ERR_CODE_INT_SER,
  MONGODB_URL,
  MONGODB_OPTIONS
};
