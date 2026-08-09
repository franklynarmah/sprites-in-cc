export class Health {
  private readonly maxHp: number;
  private hp: number;
  private invulnerableMs = 0;

  constructor(maxHp: number) {
    this.maxHp = maxHp;
    this.hp = maxHp;
  }

  get current(): number {
    return this.hp;
  }

  get max(): number {
    return this.maxHp;
  }

  get isInvulnerable(): boolean {
    return this.invulnerableMs > 0;
  }

  get isDead(): boolean {
    return this.hp <= 0;
  }

  update(delta: number): void {
    if (this.invulnerableMs > 0) {
      this.invulnerableMs = Math.max(0, this.invulnerableMs - delta);
    }
  }

  /** Returns true if the damage was actually applied (false while invulnerable or dead). */
  damage(amount: number, invulnerabilityMs: number): boolean {
    if (this.isInvulnerable || this.isDead) {
      return false;
    }
    this.hp = Math.max(0, this.hp - amount);
    this.invulnerableMs = invulnerabilityMs;
    return true;
  }

  fullRestore(): void {
    this.hp = this.maxHp;
    this.invulnerableMs = 0;
  }

  grantInvulnerability(ms: number): void {
    this.invulnerableMs = Math.max(this.invulnerableMs, ms);
  }
}
