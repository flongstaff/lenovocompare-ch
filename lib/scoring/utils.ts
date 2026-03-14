/**
 * Shared types and utilities for scoring sub-modules.
 */

export interface ScoreComponent {
  readonly label: string;
  readonly earned: number;
  readonly max: number;
}
