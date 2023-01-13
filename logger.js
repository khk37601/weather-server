import { format as _format, createLogger, transports as _transports } from 'winston';
import 'winston-daily-rotate-file';
const { combine, timestamp, printf } = _format;

const customFormat = printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});

const logger = createLogger({
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        customFormat,
    ),
    transports: [
        new _transports.DailyRotateFile({
            level: 'info',
            datePattern: 'YYYY-MM-DD',
            dirname: '/var/log/weather/',
            filename: `%DATE%.log`,
            maxSize: '20m',
            maxFiles: '7d',
            zippedArchive: true,
        }),
        new _transports.DailyRotateFile({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: '/var/log/weather',
            filename: `%DATE%.error.log`,
            maxSize: '20m',
            maxFiles: '7d',
            zippedArchive: true,
        }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(
      new _transports.Console({
        format: _format.combine(_format.colorize(), _format.simple()),
      }),
    );
  }

const stream = {
    write: message => {
      logger.info(message)
    }
}

export { logger, stream };