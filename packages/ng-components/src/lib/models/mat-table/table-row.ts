export interface TableRow {
  rowStyle?: {
    backgroundColor?: string;
    color?: string;
    [key: string]: any;
  };
  disableSelection?: boolean;
  [key: string]: any;
}
