/** @param {unknown} error @param {import('express').Request} _req @param {import('express').Response} res @param {import('express').NextFunction} _next */
export function errorHandler(error, _req, res, _next) {
  const message =
    error instanceof Error
      ? error.message
      : "Unknown error";

  const statusCode =
    // @ts-ignore
    error?.statusCode || 500;

  console.error(error);

  res.status(statusCode).json({
    success: false,
    error:
      statusCode === 500
        ? "Internal server error"
        : message,

    ...(process.env.NODE_ENV === "development" &&
      statusCode === 500 && { message }),
  });
}


/** @param {import('express').Request} _req @param {import('express').Response} res */
export function notFoundHandler(_req, res) {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
}