import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

export type PasswordStrength = 'weak' | 'fair' | 'medium' | 'good' | 'strong';

interface StrengthConfig {
  label: string;
  percentage: number;
  labelClass: string;
  barClass: string;
}

const STRENGTH_CONFIG: Record<PasswordStrength, StrengthConfig> = {
  weak: { label: 'Weak', percentage: 15, labelClass: 'text-fg-danger', barClass: 'bg-danger' },
  fair: { label: 'Fair', percentage: 30, labelClass: 'text-fg-warning', barClass: 'bg-warning' },
  medium: { label: 'Medium', percentage: 50, labelClass: 'text-heading', barClass: 'bg-dark' },
  good: { label: 'Good', percentage: 65, labelClass: 'text-fg-brand', barClass: 'bg-brand' },
  strong: {
    label: 'Strong',
    percentage: 100,
    labelClass: 'text-fg-success',
    barClass: 'bg-success',
  },
};

@Component({
  selector: 'app-password-strength',
  imports: [CommonModule],
  templateUrl: './password-strength.component.html',
  styleUrl: './password-strength.component.css',
})
export class PasswordStrengthComponent {
  readonly password = input.required<string>();

  readonly strength = computed<PasswordStrength>(() => this.evaluate(this.password()));
  readonly config = computed<StrengthConfig>(() => STRENGTH_CONFIG[this.strength()]);

  private evaluate(password: string): PasswordStrength {
    if (!password) return 'weak';

    const criteria = {
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasDigit: /\d/.test(password),
      hasSpecial: /[!@#$%^&*]/.test(password),
      hasMinLength: password.length >= 8,
      hasGoodLength: password.length >= 12,
      hasGreatLength: password.length >= 16,
    };

    const score = Object.values(criteria).filter(Boolean).length;

    const baseValid =
      criteria.hasUppercase && criteria.hasLowercase && criteria.hasDigit && criteria.hasSpecial;

    if (!baseValid) {
      return score <= 2 ? 'weak' : 'fair';
    }

    if (criteria.hasGreatLength) return 'strong';
    if (criteria.hasGoodLength) return 'good';
    return 'medium';
  }
}
