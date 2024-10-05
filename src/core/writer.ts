export interface IWriter {
  /**
   * The full directory path such as '/home/user/dir' or 'c:\path\dir'
   */
  dir: string;
  /**
   * The file name without extension (if any) such as 'index'
   */
  name: string;
  /**
   *  The extension of the file such as '.html' if any
   */
  ext: string;
  /**
   * The full path to the file 
   */
  path: string; 
  content: string;  
  write: () => Promise<WriterReport>;
}

export type WriterReport<TWriter extends IWriter = IWriter> = {
  status: "success" | "error";
  writer: TWriter;
  message?: string;
  detail?: unknown;
};

export enum WriterStatus {
  "success",
  "error",
}
