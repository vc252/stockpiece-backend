import winston from "winston";
// import { MongoDB } from "winston-mongodb"

const logger: winston.Logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  level: process.env.LOG_LEVEL || "info",
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.cli(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level} ${message}`;
        })
      ),
    }),
  ],
});

export default logger;

//production i want errors and start code
//on devlopment i want errors code and start code plus the code info code
//I think i should use a single logger plus debug logger for inside logs
//it would be more uniform

//why can't we just make the normal logs as console
//but i think we won't have anywhere to tranport them that is the issue
//but i only need the error logs to be displayed in the telegram
//the info logs can be displayed as usual

//the internal server error should be error and rest should be warning
//the ciritcal is for special purposes

//or i can use the syslogs
//with notice being the start of the server and all
//
