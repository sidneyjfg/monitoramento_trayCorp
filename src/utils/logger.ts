import { createLogger, format, transports } from 'winston';
import { mysqlTransport } from './mysqlTransport';

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    mysqlTransport
  ],
});

export const logOrderMonitoring = async (params: any, statusCode: number) => {
  const message = `Monitoramento executado com status: ${statusCode}`;
  logger.info(message, { params, statusCode });
};
