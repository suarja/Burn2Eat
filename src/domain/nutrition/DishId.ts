export class DishId {
  private constructor(private value: string) {}
  static from(value: string): DishId {
    return new DishId(value)
  }
  public toString(): string {
    return this.value
  }
}
