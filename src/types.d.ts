// Global type definitions

// Jest
declare const jest: any;
declare namespace jest {
  interface Mock<T = any, Y extends any[] = any[]> {
    (...args: Y): T;
    mockImplementation(fn: (...args: Y) => T): this;
    mockReturnValue(value: T): this;
    mockReturnThis(): this;
    mockResolvedValue(value: T): this;
    mockRejectedValue(value: any): this;
    mockClear(): this;
    mockReset(): this;
    mockRestore(): this;
    mockName(name: string): this;
    getMockName(): string;
    mock: {
      calls: Y[];
      instances: T[];
      invocationCallOrder: number[];
      results: Array<{ type: string; value: any }>;
    };
  }
  
  type MockableFunction = (...args: any[]) => any;
  
  interface MockWithArgs<T extends MockableFunction> extends Mock<ReturnType<T>, Parameters<T>> {}
  
  function fn<T extends MockableFunction>(): MockWithArgs<T>;
  function fn<T>(): Mock<T>;
  
  function spyOn<T extends {}, M extends keyof T>(
    object: T,
    method: M
  ): MockWithArgs<T[M] extends MockableFunction ? T[M] : never>;
  
  function setTimeout(callback: Function, timeout: number): void;
  function clearTimeout(timeoutId: number): void;
}

// React
declare namespace React {
  interface ReactNode {
    children?: ReactNode | ReactNode[];
  }
  
  interface FC<P = {}> {
    (props: P): ReactNode | null;
    displayName?: string;
  }
  
  interface ComponentType<P = {}> {
    (props: P): ReactNode | null;
    displayName?: string;
  }
  
  interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }
  
  type Key = string | number;
  
  interface JSXElementConstructor<P> {
    (props: P): ReactElement<any, any> | null;
  }
  
  type ReactFragment = {} | ReactNodeArray;
  interface ReactNodeArray extends Array<ReactNode> {}
  type ReactChild = ReactElement | string | number;
  type ReactText = string | number;
}

// Node
declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
    NODE_ENV: 'development' | 'production' | 'test';
    OPENAI_API_KEY?: string;
    AWS_ACCESS_KEY_ID?: string;
    AWS_SECRET_ACCESS_KEY?: string;
    AWS_REGION?: string;
    AWS_S3_BUCKET?: string;
    STRIPE_SECRET_KEY?: string;
    STRIPE_WEBHOOK_SECRET?: string;
    STRIPE_PUBLISHABLE_KEY?: string;
    SENDGRID_API_KEY?: string;
    GOOGLE_JOBS_API_KEY?: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    LINKEDIN_CLIENT_ID?: string;
    LINKEDIN_CLIENT_SECRET?: string;
    PAYMENTS_BASIC_SUBSCRIPTION_PLAN_ID?: string;
    PAYMENTS_PROFESSIONAL_SUBSCRIPTION_PLAN_ID?: string;
    PAYMENTS_ENTERPRISE_SUBSCRIPTION_PLAN_ID?: string;
    PAYMENTS_CREDITS_10_PLAN_ID?: string;
    PAYMENTS_CREDITS_50_PLAN_ID?: string;
    PAYMENTS_CREDITS_100_PLAN_ID?: string;
  }
}

declare const process: {
  env: NodeJS.ProcessEnv;
};

// Global
declare const global: {
  fetch: typeof fetch;
  [key: string]: any;
};

// Buffer
declare class Buffer extends Uint8Array {
  constructor(arg: string | number[] | ArrayBuffer | SharedArrayBuffer, encodingOrOffset?: string | number, length?: number);
  
  static from(arrayBuffer: ArrayBuffer): Buffer;
  static from(arrayBuffer: ArrayBuffer, byteOffset: number, length?: number): Buffer;
  static from(data: any[]): Buffer;
  static from(data: Uint8Array): Buffer;
  static from(str: string, encoding?: string): Buffer;
  static isBuffer(obj: any): obj is Buffer;
  static concat(list: Buffer[], totalLength?: number): Buffer;
  static alloc(size: number): Buffer;
  
  toString(encoding?: string, start?: number, end?: number): string;
  toJSON(): { type: 'Buffer'; data: number[] };
  equals(otherBuffer: Uint8Array): boolean;
  compare(target: Uint8Array, targetStart?: number, targetEnd?: number, sourceStart?: number, sourceEnd?: number): number;
  copy(target: Uint8Array, targetStart?: number, sourceStart?: number, sourceEnd?: number): number;
  slice(start?: number, end?: number): Buffer;
  write(string: string, offset?: number, length?: number, encoding?: string): number;
  writeUInt8(value: number, offset: number): number;
  readUInt8(offset: number): number;
}

// Blob
declare class Blob {
  constructor(blobParts?: BlobPart[], options?: BlobPropertyBag);
  readonly size: number;
  readonly type: string;
  arrayBuffer(): Promise<ArrayBuffer>;
  slice(start?: number, end?: number, contentType?: string): Blob;
  text(): Promise<string>;
  stream(): ReadableStream;
}

interface BlobPart {
  [Symbol.toStringTag]: 'Blob';
}

interface BlobPropertyBag {
  type?: string;
  endings?: 'transparent' | 'native';
}
