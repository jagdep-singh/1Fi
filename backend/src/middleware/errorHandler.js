export function errorHandler(err, req, res, next) {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : "server error";

  res.status(statusCode).json({ error: message });
}