import axios from 'axios';
import { ITelegramConfig } from './configurations';
import { ILogger } from './logger';

export interface ISystemNotify {
  sendErrorToTelegram(title: string, error?: any): Promise<void>;
  sendSuccessMessageToTelegram(title: string): Promise<void>;
}

export default class SystemNotify implements ISystemNotify {
  constructor(public config: ITelegramConfig, public logger: ILogger) {}

  private changeErrorObjectToMessage(error: any) {
    if (!error) return '';
    let text = '';

    if (typeof error === 'string' && error.trim()) {
      text += `\n - Message: ${error}`;
    }

    if (typeof error.code === 'string' || typeof error.code === 'number') {
      text += `\n - Code: ${error.code}`;
    }

    if (typeof error.message === 'string') {
      text += `\n - Message: ${error.message}`;
    }

    if (typeof error.details === 'object') {
      if (typeof error.details.code === 'string') {
        text += `\n - Code Detail: ${error.details.code}`;
      }

      if (typeof error.details.message === 'string') {
        text += `\n - Message Detail: ${error.details.message}`;
      }

      if (typeof error.details.localMessage === 'string') {
        text += `\n - Local Message Detail: ${error.details.localMessage}`;
      }
    }

    return text;
  }

  private async sendMessageToTelegram(message: string) {
    if (this.config.isAllowSendMessage != '1') return;
    const isSend =
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'staging' ||
      process.env.NODE_ENV === 'production';
    if (!isSend) return;

    const splitDate = new Date()
      .toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })
      .split('/');
    const formatDate = `${splitDate[1]}/${splitDate[0]}/${splitDate[2]}, VietNam`;

    try {
      await axios({
        url: `https://api.telegram.org/bot${this.config.botToken}/sendMessage`,
        method: 'POST',
        data: {
          chat_id: this.config.chanelId,
          text: `${formatDate}\n\n${message}`
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return;
    } catch (error) {
      this.logger.error('Send telegram message error', error);
      return;
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async sendErrorToTelegram(title: string, error?: any): Promise<void> {
    return this.sendMessageToTelegram(
      `❌ ${this.config.prefix}\n\n${title} \n${this.changeErrorObjectToMessage(error)}`
    );
  }

  async sendSuccessMessageToTelegram(title: string): Promise<void> {
    return this.sendMessageToTelegram(`✅ ${this.config.prefix}\n\n${title}`);
  }
}
