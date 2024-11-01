import { createLogger, transports, format } from "winston";
import { WinstonTransportPostgres } from "@/utils/winstonTransportPostgres";
const { combine, timestamp, label, printf, splat } = format;

const winstonTransportPostgres = new WinstonTransportPostgres({});

const defaultFormat = printf((info) => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${
    info.message
  } ${JSON.stringify(info.meta)}`;
});

export default function Log(labelInfo: string) {
  const logger = createLogger({
    transports: [new transports.Console(), winstonTransportPostgres],
    format: combine(
      label({ label: labelInfo }),
      splat(),
      timestamp(),
      defaultFormat
    ),
  });

  return logger;
}
