export interface ISQLDatabase<U = any> {
  query: <K extends U>(query: string, values?: any[]) => Promise<K[]>
}
