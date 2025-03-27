import winston from "winston";

/**
 * Configured Winston logger instance for logging application messages.
 *
 * @constant {winston.Logger} logger
 * @description This logger is set to "debug" level in development and "info" in production.
 * It formats logs with timestamp, colorization, pretty printing, and error stack traces.
 *
 * @example
 * logger.info("This is an info message");
 * logger.debug("Debugging details...");
 * logger.error("An error occurred!", new Error("Sample error"));
 */

export const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: winston.format.combine(
        winston.format(info => ({ ...info, level: info.level.toUpperCase() }))(),
        winston.format.align(),
        winston.format.colorize({ all: true }),
        winston.format.errors({ stack: true }),
        winston.format.prettyPrint(),
        winston.format.simple(),
        winston.format.splat(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss A" }),
        winston.format.printf(
            ({ timestamp, level, message }) =>
                `[${timestamp}] [PID: ${process.pid}] [${level}]: ${message}`
        )
    ),
    transports: [new winston.transports.Console()],
});
