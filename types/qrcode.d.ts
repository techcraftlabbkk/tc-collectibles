declare module 'qrcode' {
  interface QRCodeToDataURLOptions {
    errorCorrectionLevel?: string;
    type?: string;
    quality?: number;
    margin?: number;
    width?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }

  interface QRCodeToStringOptions extends QRCodeToDataURLOptions {
    type?: 'utf8' | 'svg' | 'terminal' | 'terminal_utf8';
  }

  export function toDataURL(
    text: string,
    options?: QRCodeToDataURLOptions
  ): Promise<string>;

  export function toString(
    text: string,
    options?: QRCodeToStringOptions
  ): Promise<string>;

  export function toFile(
    path: string,
    text: string,
    options?: QRCodeToDataURLOptions
  ): Promise<void>;

  export function toCanvas(
    canvas: any,
    text: string,
    options?: QRCodeToDataURLOptions
  ): Promise<void>;
}
