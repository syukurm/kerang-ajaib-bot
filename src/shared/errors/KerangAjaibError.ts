export default class KerangAjaibError extends Error {
  public override readonly name = "KerangAjaibError";

  public constructor(message = "Something went wrong", cause?: unknown) {
    super(message);
    this.cause = cause;
  }
}
