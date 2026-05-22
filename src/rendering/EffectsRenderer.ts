import { Container, Graphics } from 'pixi.js';
import { COLORS } from '../config';

export class EffectsRenderer {
  container: Container;
  private nightOverlay: Graphics;
  private auraGraphics: Graphics;
  private particleGraphics: Graphics;
  private nightAlpha = 0;
  private time = 0;

  constructor(width: number, height: number) {
    this.container = new Container();

    this.auraGraphics = new Graphics();
    this.particleGraphics = new Graphics();
    this.nightOverlay = new Graphics();

    this.container.addChild(this.auraGraphics);
    this.container.addChild(this.particleGraphics);
    this.container.addChild(this.nightOverlay);

    this.nightOverlay.rect(-2000, -2000, width + 4000, height + 4000);
    this.nightOverlay.fill(COLORS.night);
    this.nightOverlay.alpha = 0;
  }

  setNightAlpha(alpha: number): void {
    this.nightAlpha = alpha;
    this.nightOverlay.alpha = alpha * 0.7;
  }

  drawAura(screenX: number, screenY: number, radius: number): void {
    this.auraGraphics.circle(screenX, screenY, radius);
    this.auraGraphics.fill({ color: COLORS.goldAura, alpha: 0.08 });
    this.auraGraphics.circle(screenX, screenY, radius);
    this.auraGraphics.stroke({ color: COLORS.goldAura, width: 2, alpha: 0.3 });

    const innerR = radius * 0.6;
    this.auraGraphics.circle(screenX, screenY, innerR);
    this.auraGraphics.fill({ color: COLORS.goldAura, alpha: 0.05 });
  }

  clearAuras(): void {
    this.auraGraphics.clear();
  }

  drawDustParticle(screenX: number, screenY: number): void {
    const size = 1 + Math.random() * 2;
    this.particleGraphics.circle(screenX + Math.random() * 10 - 5, screenY + Math.random() * 5, size);
    this.particleGraphics.fill({ color: COLORS.sand, alpha: 0.3 + Math.random() * 0.3 });
  }

  clearParticles(): void {
    this.particleGraphics.clear();
  }

  drawZoneHighlight(x1: number, y1: number, x2: number, y2: number, color: number): void {
    this.auraGraphics.rect(x1, y1, x2 - x1, y2 - y1);
    this.auraGraphics.fill({ color, alpha: 0.15 });
    this.auraGraphics.rect(x1, y1, x2 - x1, y2 - y1);
    this.auraGraphics.stroke({ color, width: 3, alpha: 0.5 });
  }

  update(dt: number): void {
    this.time += dt;
  }
}
