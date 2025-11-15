const buffer = [];
const BUFFER_LIMIT = 12;

function bufferMiddleware(req, res, next) {
  buffer.push({ ...req.body });

  if (buffer.length > BUFFER_LIMIT) {
    buffer.shift();
  }

  req.buffer = buffer;
  next();
}

module.exports = {
  bufferMiddleware,
  buffer
};
