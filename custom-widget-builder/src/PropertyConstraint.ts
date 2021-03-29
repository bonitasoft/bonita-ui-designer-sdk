export class PropertyConstraint {
  public min: string | undefined;
  public max: string | undefined;

  constructor(min: string | undefined, max: string | undefined) {
    this.min = min;
    this.max = max;
  }
}
