import { MERCHANT_SPAWN_CHANCE, MERCHANT_STAY_TICKS, MERCHANT_COOLDOWN_TICKS } from '../config';
import { MerchantState, MerchantItem, generateMerchantInventory } from '../data/MerchantModel';
import { ResourceStore } from '../data/ResourceStore';
import { EventBus } from '../core/EventBus';

export class MerchantSystem {
  private merchant: MerchantState;
  private resources: ResourceStore;
  private events: EventBus;
  discountRate = 0;

  constructor(merchant: MerchantState, resources: ResourceStore, events: EventBus) {
    this.merchant = merchant;
    this.resources = resources;
    this.events = events;
  }

  update(isNight: boolean): void {
    if (this.merchant.present) {
      this.merchant.stayTimer--;
      if (this.merchant.stayTimer <= 0) {
        this.merchant.present = false;
        this.merchant.cooldownTimer = MERCHANT_COOLDOWN_TICKS;
        this.events.emit('merchant:departed', {});
      }
      return;
    }

    if (this.merchant.cooldownTimer > 0) {
      this.merchant.cooldownTimer--;
      return;
    }

    if (!isNight && Math.random() < MERCHANT_SPAWN_CHANCE) {
      this.merchant.present = true;
      this.merchant.stayTimer = MERCHANT_STAY_TICKS;
      this.merchant.inventory = generateMerchantInventory();
      this.merchant.worldX = 1;
      this.merchant.worldY = 18 + Math.random() * 4;
      this.events.emit('merchant:arrived', {});
    }
  }

  purchase(itemId: string): boolean {
    if (!this.merchant.present) return false;

    const item = this.merchant.inventory.find(i => i.id === itemId);
    if (!item || item.stock <= 0) return false;
    const finalCost = Math.max(1, Math.floor(item.goldCost * (1 - this.discountRate)));
    if (this.resources.gold < finalCost) return false;

    this.resources.gold -= finalCost;
    item.stock--;

    switch (item.type) {
      case 'bread':
        this.resources.bread += item.quantity;
        break;
      case 'beer':
        this.resources.beer += item.quantity;
        break;
      case 'cedar':
        this.resources.cedar += item.quantity;
        break;
      case 'hide':
        this.resources.hide += item.quantity;
        break;
      case 'papyrus':
        this.resources.papyrus += item.quantity;
        break;
      case 'ancientTech':
        this.resources.ancientTech += item.quantity;
        break;
      case 'relic':
        this.events.emit('merchant:relic_purchased', { id: item.id });
        break;
      case 'mercenary':
        this.events.emit('merchant:mercenary_purchased', {});
        break;
      case 'trap':
        this.events.emit('merchant:trap_purchased', { id: item.id });
        break;
      case 'decoration':
        this.events.emit('merchant:decoration_purchased', { id: item.id });
        break;
    }

    this.events.emit('merchant:purchase', { itemId: item.id, goldSpent: finalCost });
    return true;
  }

  getState(): MerchantState {
    return this.merchant;
  }
}
