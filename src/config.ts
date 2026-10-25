export const TUNING = { speed: 185, aimRadius: 100, extinguishSeconds: 8, volume: .055, waterRange: 610, maxParticles: 190 };
export type Stage = 'call' | 'drive' | 'fires' | 'park' | 'ladder' | 'rescuing' | 'celebrate' | 'free';
export class Mission {
  stage: Stage = 'call';
  advance(event: string) {
    const transitions: Partial<Record<Stage, Record<string, Stage>>> = {call:{play:'drive'},drive:{arrive:'fires'},fires:{clear:'park'},park:{extend:'ladder'},ladder:{retract:'park',rescue:'rescuing'},rescuing:{home:'celebrate'}};
    this.stage = transitions[this.stage]?.[event] ?? this.stage;
  }
}
