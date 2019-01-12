/* ::START::LICENCE::
Copyright eQualityTime ©2018
This file is part of OVFPlayer.
OVFPlayer is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
OVFPlayer is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with OVFPlayer.  If not, see <https://www.gnu.org/licenses/>.
::END::LICENCE:: */
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
  static BOARD_PARSE_ERROR   = 8;
  static MANIFEST_JSON_ERROR = 9;
  static BOARD_NOT_THERE     = 10;
  static SOUND_NOT_THERE     = 11;
  static IMAGE_NOT_THERE     = 12;
  static OBF_VALIDATION      = 13;
  static INVALID_ROOT        = 14;
}
