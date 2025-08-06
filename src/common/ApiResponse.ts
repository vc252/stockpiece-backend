export class ApiResponse<T> {
  public readonly success: boolean;
  constructor(
    public readonly statusCode: number = 200,
    public readonly message = "",
    public readonly data: T,
    public readonly timestamp = new Date()
  ) {
    this.success = this.statusCode < 400;
  }
}
