export class Permission {
  constructor(
    public readonly resource: string,
    public readonly action: string,
    public readonly subResource?: string,
  ) {}

  static fromString(permString: string): Permission {
    const parts = permString.split(':');
    if (parts.length === 2) {
      return new Permission(parts[0], parts[1]);
    } else if (parts.length === 3) {
      return new Permission(parts[0], parts[2], parts[1]);
    }
    throw new Error(`Invalid permission format: ${permString}`);
  }

  toString(): string {
    if (this.subResource) {
      return `${this.resource}:${this.subResource}:${this.action}`;
    }
    return `${this.resource}:${this.action}`;
  }

  equals(other: Permission): boolean {
    return this.toString() === other.toString();
  }

  implies(other: Permission): boolean {
    return this.equals(other);
  }
}
