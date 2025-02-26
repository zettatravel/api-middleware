import winston from "winston";


export const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: winston.format.combine(
        winston.format(info => ({...info, level: info.level.toUpperCase()}))(),
        winston.format.align(),
        winston.format.colorize({ all: true }),
        winston.format.errors({stack: true}),
        winston.format.prettyPrint(),
        winston.format.simple(),
        winston.format.splat(),
        winston.format.timestamp({format: "YYYY-MM-DD HH:mm:ss A"}),
        winston.format.printf(
            ({timestamp, level, message}) => `[${timestamp}] [${level}]:${message}`
        )
    ),
    transports: [new winston.transports.Console()],
});