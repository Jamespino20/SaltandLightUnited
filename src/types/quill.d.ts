declare module "quill" {
  class Quill {
    static register(modules: Record<string, unknown>, ignoreDuplicate?: boolean): void;
    root: HTMLElement;
    constructor(container: HTMLElement, options?: Record<string, unknown>);
    on(event: string, handler: () => void): void;
    off(event: string, handler: () => void): void;
    setContents(delta: unknown): void;
    getContents(): unknown;
  }
  export default Quill;
}

declare module "quill-table-better" {
  const Table: unknown;
  export default Table;
}
