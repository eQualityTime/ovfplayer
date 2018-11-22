export class OpenVoiceFactoryError extends Error {

  private   cause: Error;
  protected clz:   string;

  constructor(message?: string, cause?: Error) {
    super(message);
    this.cause = cause;
    this.clz = 'OpenVoiceFactoryError';
  }
}

export class FatalOpenVoiceFactoryError extends OpenVoiceFactoryError {

  constructor(message?: string, cause?: Error) {
    super(message, cause);
    this.clz = 'FatalOpenVoiceFactoryError';
  }
}
