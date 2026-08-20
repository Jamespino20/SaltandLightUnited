declare module "quill" {
  class Quill {
    root: HTMLElement;
    constructor(container: HTMLElement, options?: Record<string, unknown>);
    on(event: string, handler: () => void): void;
    off(event: string, handler: () => void): void;
    setContents(delta: unknown): void;
    getContents(): unknown;
  }
  export default Quill;
}
