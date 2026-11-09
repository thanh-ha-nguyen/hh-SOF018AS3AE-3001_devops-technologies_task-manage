import { appendFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

type LogLevel = 'info' | 'warn' | 'error';
const logFile = process.env.LOG_FILE;

if (logFile) {
  mkdirSync(dirname(logFile), { recursive: true });
}

export const log = (
  level: LogLevel,
  message: string,
  fields: Record<string, unknown> = {}
): void => {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    service: 'task-management-api',
    message,
    ...fields
  };

  const line = `${JSON.stringify(entry)}\n`;
  process.stdout.write(line);

  if (logFile) {
    appendFileSync(logFile, line);
  }
};
