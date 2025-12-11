import TransportStream from 'winston-transport';
import { getMonitoramentoConnection } from '../config/dbConfig';
import { formatDateForMysql } from './lib';

interface MysqlTransportOptions extends TransportStream.TransportStreamOptions {
  tableName: string;
}

class MysqlTransport extends TransportStream {
  private tableName: string;

  constructor(opts: MysqlTransportOptions) {
    super(opts);
    this.tableName = opts.tableName;
  }

  async log(info: any, callback: () => void) {
    setImmediate(() => this.emit('logged', info));

    const connection = await getMonitoramentoConnection();
    const formattedDate = formatDateForMysql(new Date());

    try {
      const query = `INSERT INTO ${this.tableName} (log_level, log_message, created_at) VALUES (?, ?, ?)`;
      const params = [info.level, info.message, formattedDate];

      await connection.query(query, params);
    } catch (error: any) { 
      console.error('Erro ao gravar log no MySQL:', error);
    } finally {
      connection.release();
    }

    callback();
  }
}

export const mysqlTransport = new MysqlTransport({ tableName: 'logs' });
