export class OpenVoiceFactoryError extends Error {

  private   cause:     Error;
  protected clz:       string;
  private   errorCode: number;

  constructor(errorCode: number, message?: string, cause?: Error) {
    super(message);
    this.cause = cause;
    this.clz = 'OpenVoiceFactoryError';
    this.errorCode = errorCode;
  }
}

export class FatalOpenVoiceFactoryError extends OpenVoiceFactoryError {

  constructor(errorCode: number, message?: string, cause?: Error) {
    super(errorCode, message, cause);
    this.clz = 'FatalOpenVoiceFactoryError';
  }
}

export class ErrorCodes {
  static MISSING_MANIFEST    = 0;
  static OBF_LOAD_ERROR      = 1;
  static OBZ_PARSE_ERROR     = 2;
  static OBZ_DOWNLOAD_ERROR  = 3;
  static MANIFEST_LOAD_ERROR = 4;
  static ZIP_PARSE_ERROR     = 5;
  static IMAGE_LOAD_ERROR    = 6;
  static SOUND_LOAD_ERROR    = 7;
  static BOARD_LOAD_ERROR    = 8;
}
