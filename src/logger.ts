import { config } from "./config";
import { default as pino } from "pino";

export const logger = pino({ level: config.logLevel });
