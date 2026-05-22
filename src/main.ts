import { Application, Container, Graphics } from 'pixi.js';
import { render, h } from 'preact';
import { App, GameUIState } from './ui/App';
import { World } from './core/ECS';
import { EventBus } from './core/EventBus';
import { GameLoop } from './core/GameLoop';
import {
  WORKER_SPAWN_COST, SOLDIER_SPAWN_COST, SUPERVISOR_SPAWN_COST,
  SUPERVISOR_AURA_RADIUS, SUPERVISOR_SPEED_BUFF, COLORS, ENERGY_MAX,
} from './config';
import {
  createPosition, createWorker, createRenderable, createDraggable,
  createSupervisor, createSoldier,
  Position, Worker, Renderable, Supervisor, Mummy,
} from './components';
import { worldToScreen, lerp } from './math/isometric';

import { ResourceStore } from './data/ResourceStore';
import { PyramidModel } from './data/PyramidModel';
import { createZoneStates } from './data/ZoneModel';
import { DECORATIONS } from './data/DecorationModel';

import { CameraSystem } from './systems/CameraSystem';
import { InputSystem } from './systems/InputSystem';
import { DayNightSystem } from './systems/DayNightSystem';
import { WorkerSystem } from './systems/WorkerSystem';
import { SupervisorSystem } from './systems/SupervisorSystem';
import { ResourceSystem } from './systems/ResourceSystem';
import { PyramidBuildSystem } from './systems/PyramidBuildSystem';
import { RobberAISystem } from './systems/RobberAISystem';
import { TrapSystem } from './systems/TrapSystem';
import { MerchantSystem } from './systems/MerchantSystem';
import { createMerchantState } from './data/MerchantModel';
import { createDynasty } from './data/DynastyModel';
import { DynastySystem } from './systems/DynastySystem';
import { MummySystem } from './systems/MummySystem';
import { PlagueSystem } from './systems/PlagueSystem';
import { createTechTree, researchTech, canResearch, getTechEffect } from './data/TechTreeModel';
import { createMercenaryMarket, MERCENARY_TYPES } from './data/MercenaryModel';
import { MercenarySystem } from './systems/MercenarySystem';
import { saveGame, loadGame, hasSave } from './data/SaveSystem';
import { TRAIT_POOL } from './data/DynastyModel';

import { WorldRenderer } from './rendering/WorldRenderer';
import { PyramidRenderer } from './rendering/PyramidRenderer';
import { EffectsRenderer } from './rendering/EffectsRenderer';
import { preloadSprites, createUnit, updateWorkerCarrying, setMummyType } from './rendering/SpriteManager';
import { pushToast } from './ui/ToastSystem';

async function main() {
  const app = new Application();
  await app.init({
    resizeTo: window,
    background: COLORS.sand,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  const canvasEl = document.getElementById('game-canvas')!;
  canvasEl.appendChild(app.canvas);

  await preloadSprites();

  const world = new World();
  const events = new EventBus();
  const resources = new ResourceStore();
  const pyramidModel = new PyramidModel();
  const zoneStates = createZoneStates();

  const camera = new CameraSystem(app.screen.width, app.screen.height);
  const inputSystem = new InputSystem(app.canvas as HTMLElement, camera, world, events);
  const dayNight = new DayNightSystem(events);
  const workerSystem = new WorkerSystem(events, resources);
  const supervisorSystem = new SupervisorSystem();
  const resourceSystem = new ResourceSystem(resources, events);
  resourceSystem.setPyramidModel(pyramidModel);
  const pyramidBuild = new PyramidBuildSystem(pyramidModel, events);
  const robberAI = new RobberAISystem(pyramidModel, events);
  const trapSystem = new TrapSystem(events, resources, pyramidModel);
  const merchantState = createMerchantState();
  const merchantSystem = new MerchantSystem(merchantState, resources, events);
  const dynasty = createDynasty(1);
  const dynastySystem = new DynastySystem(dynasty, events);
  resourceSystem.setDynastySystem(dynastySystem);
  const mummySystem = new MummySystem(events, pyramidModel);
  const plagueSystem = new PlagueSystem(events, resources);
  const techTree = createTechTree();
  const mercenaryMarket = createMercenaryMarket();
  const mercenarySystem = new MercenarySystem(events, resources, mercenaryMarket);

  const worldContainer = new Container();
  app.stage.addChild(worldContainer);

  const worldRenderer = new WorldRenderer();
  const pyramidRenderer = new PyramidRenderer(pyramidModel);
  const effectsRenderer = new EffectsRenderer(app.screen.width, app.screen.height);

  const entityContainer = new Container();
  const unitGraphicsMap = new Map<number, Container>();

  worldContainer.addChild(worldRenderer.container);
  worldContainer.addChild(pyramidRenderer.container);
  worldContainer.addChild(entityContainer);
  worldContainer.addChild(effectsRenderer.container);

  // ---- Restore save data ----
  const saveData = loadGame();
  if (saveData) {
    resources.stone = saveData.resources.stone;
    resources.bread = saveData.resources.bread;
    resources.beer = saveData.resources.beer;
    resources.gold = saveData.resources.gold;
    resources.cedar = saveData.resources.cedar;
    resources.hide = saveData.resources.hide;
    resources.papyrus = saveData.resources.papyrus;
    resources.ancientTech = saveData.resources.ancientTech;
    resources.curses = saveData.resources.curses;
    resources.energy = saveData.resources.energy;

    for (let i = 0; i < saveData.pyramid.layers.length && i < pyramidModel.layers.length; i++) {
      const saved = saveData.pyramid.layers[i];
      const layer = pyramidModel.layers[i];
      layer.stonesPlaced = saved.stonesPlaced;
      layer.complete = saved.complete;
      layer.rooms = saved.rooms.map(r => ({
        id: r.id,
        type: r.type as import('./data/PyramidModel').RoomType,
        gridX: r.gridX,
        gridY: r.gridY,
        width: 1,
        height: 1,
        layer: i,
        decorations: [...r.decorations],
        treasureValue: 0,
        trapPower: 0,
      }));
    }
    pyramidModel.currentLayer = saveData.pyramid.currentLayer;
    pyramidRenderer.redraw();

    dynasty.dynastyNumber = saveData.dynasty.dynastyNumber;
    dynasty.totalReputation = saveData.dynasty.totalReputation;
    const savedPharaoh = saveData.dynasty.currentPharaoh;
    dynasty.currentPharaoh = {
      id: savedPharaoh.id,
      name: savedPharaoh.name,
      dynastyNumber: savedPharaoh.dynastyNumber,
      traits: savedPharaoh.traitIds
        .map(tid => TRAIT_POOL.find(t => t.id === tid))
        .filter((t): t is import('./data/DynastyModel').PharaohTrait => !!t),
      reignStart: savedPharaoh.reignStart,
      reignEnd: null,
      layersBuilt: savedPharaoh.layersBuilt,
      reputation: savedPharaoh.reputation,
    };

    for (const techId of saveData.tech) {
      researchTech(techTree, techId);
    }

    dayNight.dayCount = saveData.dayCount;
  }

  // ---- Event wiring ----
  events.on<{ entityId: number; zone: string; x: number; y: number }>('unit:dropped_in_zone', (data) => {
    const w = world.get<Worker>(data.entityId, 'worker');
    if (w) {
      workerSystem.assignToZone(world, data.entityId, data.zone as any);
    }
    const sup = world.get<Supervisor>(data.entityId, 'supervisor');
    if (sup) {
      // Supervisor stays where dropped
    }
  });

  events.on('layer:complete', (data: { layerIndex: number }) => {
    pyramidRenderer.redraw();
    const goldReward = 3 + Math.floor(data.layerIndex / 3);
    resources.gold += goldReward;

    let bonusMsg = '';
    if (data.layerIndex >= 10 && data.layerIndex % 5 === 0) {
      resources.ancientTech += 1;
      bonusMsg = ' | 고대기술 +1';
    }
    pushToast(`${data.layerIndex + 1}층 완성! 골드 +${goldReward}${bonusMsg}`, '🏗️', 'success');
  });

  let merchantSpriteId: number | null = null;

  events.on('merchant:arrived', () => {
    pushToast('상인이 도착했습니다!', '🐪', 'warning');
    const id = world.create();
    const spawnX = 0;
    const spawnY = 20;
    world.add(id, 'position', createPosition(spawnX, spawnY));
    world.add(id, 'renderable', createRenderable('merchant'));
    const g = createUnit('merchant');
    g.scale.set(0.8);
    unitGraphicsMap.set(id, g);
    entityContainer.addChild(g);
    merchantSpriteId = id;

    const pos = world.get<Position>(id, 'position')!;
    pos.prevX = spawnX;
    pos.prevY = spawnY;
  });

  events.on('merchant:departed', () => {
    pushToast('상인이 떠났습니다', '🐪', 'info');
    if (merchantSpriteId !== null) {
      const g = unitGraphicsMap.get(merchantSpriteId);
      if (g) {
        entityContainer.removeChild(g);
        g.destroy();
        unitGraphicsMap.delete(merchantSpriteId);
      }
      world.destroy(merchantSpriteId);
      merchantSpriteId = null;
    }
  });

  events.on('merchant:purchase', (data: { itemId: string; goldSpent: number }) => {
    pushToast(`구매 완료! 골드 -${data.goldSpent}`, '💰', 'success');
  });

  events.on('night:started', () => {
    pushToast('밤이 되었습니다 — 도굴꾼 주의!', '🌙', 'warning');
  });

  events.on('day:started', () => {
    pushToast('새로운 날이 밝았습니다', '☀️', 'info');
    for (const id of world.query('worker', 'position')) {
      const w = world.get<Worker>(id, 'worker')!;
      if (w.state === 'retreating' || w.state === 'idle') {
        if (w.zone) {
          w.state = 'idle';
        }
      }
    }
  });

  events.on('dynasty:succession', (data: { pharaoh: { name: string }; dynastyNumber: number }) => {
    pushToast(`제${data.dynastyNumber}왕조 ${data.pharaoh.name} 즉위!`, '👑', 'warning');
  });

  events.on('mummy:spawned', (data: { mummyType: string }) => {
    const names: Record<string, string> = {
      guardian: '수호 미라', priest: '사제 미라', warrior: '전사 미라',
      pharaoh: '파라오 미라', cursed: '저주받은 미라',
    };
    pushToast(`${names[data.mummyType] ?? '미라'} 소환!`, '🧟', 'info');
  });

  events.on('mummy:killed_robber', () => {
    pushToast('미라가 도굴꾼을 처치했습니다!', '⚔️', 'success');
  });

  events.on('plague:started', (data: { name: string; icon: string; severity: string; description: string }) => {
    const level = data.severity === 'catastrophic' ? 'danger' : data.severity === 'major' ? 'warning' : 'info';
    pushToast(`${data.name}: ${data.description}`, data.icon, level as 'danger' | 'warning' | 'info');
  });

  events.on('plague:ended', (data: { name: string }) => {
    pushToast(`${data.name} 재앙이 끝났습니다`, '✨', 'success');
  });

  events.on('god:blessing', (data: { name: string; icon: string; description: string }) => {
    pushToast(`${data.description}`, data.icon, 'success');
  });

  events.on('god:wrath', (data: { name: string; icon: string; description: string }) => {
    pushToast(`${data.description}`, data.icon, 'danger');
  });

  events.on('mercenary:hired', (data: { name: string; icon: string }) => {
    pushToast(`${data.name} 고용 완료!`, data.icon, 'success');
  });

  events.on('mercenary:killed_robber', (data: { name: string }) => {
    pushToast(`${data.name}이(가) 도굴꾼을 처치!`, '⚔️', 'success');
  });

  events.on('resource:food_depleted', () => {
    pushToast('식량이 고갈되었습니다! 속도 감소', '⚠️', 'danger');
    for (let i = 0; i < zoneStates.length; i++) {
      if (zoneStates[i].overtime) {
        zoneStates[i].overtime = false;
      }
    }
  });

  // ---- Spawn logic ----
  function spawnUnit(type: 'worker' | 'soldier' | 'supervisor'): void {
    const costs = { worker: WORKER_SPAWN_COST, soldier: SOLDIER_SPAWN_COST, supervisor: SUPERVISOR_SPAWN_COST };
    if (!resources.canAfford(costs[type], 'energy')) return;
    resources.spend(costs[type], 'energy');

    const id = world.create();
    const spawnX = 2 + Math.random() * 2;
    const spawnY = 19 + Math.random() * 3;

    world.add(id, 'position', createPosition(spawnX, spawnY));
    world.add(id, 'renderable', createRenderable(type === 'supervisor' ? 'supervisor' : type === 'soldier' ? 'soldier' : 'worker'));
    world.add(id, 'draggable', createDraggable());

    if (type === 'worker') {
      world.add(id, 'worker', createWorker());
    } else if (type === 'supervisor') {
      world.add(id, 'supervisor', createSupervisor());
      world.add(id, 'worker', { ...createWorker(), speedMultiplier: 1 });
    } else {
      world.add(id, 'soldier', createSoldier());
    }

    const g = createUnit(type);
    g.scale.set(0.7);
    unitGraphicsMap.set(id, g);
    entityContainer.addChild(g);
  }

  let currentHoveredLayer = -1;

  // ---- Game tick ----
  let tickCount = 0;

  function gameTick(_dt: number): void {
    tickCount++;

    camera.update();
    dayNight.update();
    resourceSystem.update(world, zoneStates);
    workerSystem.update(world, zoneStates, dayNight.isNight());
    supervisorSystem.update(world);
    robberAI.update(world, dayNight.isNight(), tickCount);
    trapSystem.update(world);
    merchantSystem.update(dayNight.isNight());
    dynastySystem.update(dayNight.dayCount);
    mummySystem.update(world, dayNight.isNight());
    plagueSystem.update(world, dayNight.dayCount);
    mercenarySystem.update(world);

    // Apply tech tree + dynasty + plague effects to WorkerSystem each tick
    workerSystem.stoneProductionBonus = getTechEffect(techTree, 'stone_production') + dynastySystem.getEffect('stone_production');
    workerSystem.foodProductionBonus = getTechEffect(techTree, 'food_production') + dynastySystem.getEffect('food_consumption');
    workerSystem.buildSpeedBonus = getTechEffect(techTree, 'build_speed') + dynastySystem.getEffect('build_speed') - Math.abs(plagueSystem.getWorkerSpeedMod());

    // Apply energy_max from tech tree
    resources.energyMax = ENERGY_MAX + getTechEffect(techTree, 'energy_max');

    // Apply energy regen from dynasty + plague
    resources.energyRegenMultiplier = Math.max(0.1, 1 + dynastySystem.getEffect('energy_regen') + plagueSystem.getEnergyRegenMod());

    // Apply merchant discount from tech tree + dynasty
    merchantSystem.discountRate = getTechEffect(techTree, 'merchant_discount') + dynastySystem.getEffect('merchant_discount');

    // Apply plague resistance from tech tree
    plagueSystem.plagueResistance = Math.min(0.9, getTechEffect(techTree, 'plague_resistance'));

    // Apply mummy power from tech tree
    mummySystem.mummyPowerBonus = getTechEffect(techTree, 'mummy_power');

    // Update entity graphics for destroyed entities
    for (const [id, g] of unitGraphicsMap) {
      if (!world.exists(id)) {
        entityContainer.removeChild(g);
        g.destroy();
        unitGraphicsMap.delete(id);
      }
    }

    // Create graphics for new robbers
    for (const id of world.query('tombRobber', 'position')) {
      if (!unitGraphicsMap.has(id)) {
        const g = createUnit('robber');
        unitGraphicsMap.set(id, g);
        entityContainer.addChild(g);
      }
    }

    // Create graphics for new mercenaries
    for (const id of world.query('mercenary', 'position')) {
      if (!unitGraphicsMap.has(id)) {
        const g = createUnit('soldier');
        g.scale.set(0.7);
        unitGraphicsMap.set(id, g);
        entityContainer.addChild(g);
      }
    }

    // Create graphics for new mummies
    for (const id of world.query('mummy', 'position')) {
      if (!unitGraphicsMap.has(id)) {
        const m = world.get<Mummy>(id, 'mummy')!;
        setMummyType(m.mummyType);
        const g = createUnit('mummy');
        g.scale.set(0.7);
        unitGraphicsMap.set(id, g);
        entityContainer.addChild(g);
      }
    }
  }

  // ---- Render ----
  function gameRender(alpha: number): void {
    worldContainer.x = camera.x;
    worldContainer.y = camera.y;

    // Update nile animation
    worldRenderer.updateNile(alpha * 50);

    const mouse = inputSystem.getMouseScreen();
    if (!inputSystem.isDragging()) {
      currentHoveredLayer = pyramidRenderer.setHoveredLayer(mouse.x, mouse.y, camera.x, camera.y);
    }

    // Day/night lighting + plague darkness
    const darknessBonus = plagueSystem.getDarknessLevel();
    effectsRenderer.setNightAlpha(Math.min(0.9, dayNight.nightAlpha + darknessBonus));

    // Draw supervisor auras
    effectsRenderer.clearAuras();
    for (const id of world.query('supervisor', 'position')) {
      const pos = world.get<Position>(id, 'position')!;
      const { sx, sy } = worldToScreen(pos.x, pos.y, pos.z);
      effectsRenderer.drawAura(sx, sy, SUPERVISOR_AURA_RADIUS);
    }

    // Update entity positions on screen
    effectsRenderer.clearParticles();

    const allRenderable = world.query('position', 'renderable');
    const sorted = allRenderable.slice().sort((a, b) => {
      const pa = world.get<Position>(a, 'position')!;
      const pb = world.get<Position>(b, 'position')!;
      return (pa.x + pa.y) - (pb.x + pb.y);
    });

    for (const id of sorted) {
      const pos = world.get<Position>(id, 'position')!;
      const rend = world.get<Renderable>(id, 'renderable')!;
      const g = unitGraphicsMap.get(id);
      if (!g) continue;

      const ix = lerp(pos.prevX, pos.x, alpha);
      const iy = lerp(pos.prevY, pos.y, alpha);
      const { sx, sy } = worldToScreen(ix, iy, pos.z);

      g.x = sx;
      g.y = sy;
      g.visible = rend.visible;
      g.alpha = rend.alpha;
      g.zIndex = (ix + iy) * 100;

      // Flip direction based on movement
      const baseScale = 0.7;
      if (pos.x !== pos.prevX) {
        g.scale.x = pos.x > pos.prevX ? baseScale : -baseScale;
      }
      g.scale.y = baseScale;

      if (rend.type === 'worker') {
        const w = world.get<Worker>(id, 'worker');
        if (w) {
          updateWorkerCarrying(g, w.carrying > 0);
          if (w.state === 'mining') {
            effectsRenderer.drawDustParticle(sx, sy);
          }
        }
      }
    }

    entityContainer.sortChildren();
  }

  // ---- UI ----
  function getUIState(): GameUIState {
    const workerIds = world.query('worker', 'position');

    const unitPositions: { x: number; y: number; type: string }[] = [];
    for (const id of world.query('position', 'renderable')) {
      const pos = world.get<Position>(id, 'position')!;
      const rend = world.get<Renderable>(id, 'renderable')!;
      unitPositions.push({ x: pos.x, y: pos.y, type: rend.type });
    }

    return {
      stone: resources.stone,
      bread: resources.bread,
      beer: resources.beer,
      gold: resources.gold,
      cedar: resources.cedar,
      hide: resources.hide,
      papyrus: resources.papyrus,
      ancientTech: resources.ancientTech,
      curses: resources.curses,
      energy: resources.energy,
      energyMax: resources.energyMax,
      currentLayer: pyramidModel.currentLayer,
      totalLayers: pyramidModel.layers.length,
      timeOfDay: dayNight.timeOfDay,
      phaseProgress: dayNight.phaseProgress,
      dayCount: dayNight.dayCount,
      workerCount: workerIds.length,
      zoneBuffers: zoneStates.map(z => z.buffer),
      zoneOvertime: zoneStates.map(z => z.overtime),
      isStarving: resourceSystem.isStarving,
      pyramidProgress: pyramidModel.getProgress(),
      merchantPresent: merchantState.present,
      merchantStayTimer: merchantState.stayTimer,
      merchantInventory: merchantState.inventory,
      cameraX: camera.x,
      cameraY: camera.y,
      screenW: app.screen.width,
      screenH: app.screen.height,
      unitPositions,
      hoveredLayer: currentHoveredLayer,
      hoveredLayerRooms: currentHoveredLayer >= 0 ? pyramidModel.getRooms(currentHoveredLayer) : [],
      pharaohName: dynasty.currentPharaoh.name,
      dynastyNumber: dynasty.dynastyNumber,
      pharaohTraits: dynasty.currentPharaoh.traits,
      pharaohReputation: dynasty.currentPharaoh.reputation,
      pharaohReignStart: dynasty.currentPharaoh.reignStart,
      pharaohLayersBuilt: dynasty.currentPharaoh.layersBuilt,
      techNodes: techTree,
      mercenaryAvailable: mercenaryMarket.available,
      pyramidComplete: pyramidModel.currentLayer >= pyramidModel.layers.length,
      totalDynastyReputation: dynasty.totalReputation + dynasty.currentPharaoh.reputation,
      activeEffects: [
        ...plagueSystem.activePlagues.map(ap => ({
          icon: ap.plague.icon,
          name: ap.plague.name,
          remaining: ap.remainingTicks,
          total: ap.plague.duration,
          type: 'plague' as const,
          severity: ap.plague.severity,
        })),
        ...plagueSystem.activeBlessings.map(ab => ({
          icon: ab.god.icon,
          name: ab.god.name,
          remaining: ab.remainingTicks,
          total: ab.god.blessing.duration,
          type: 'blessing' as const,
        })),
      ],
    };
  }

  function handleToggleOvertime(zoneIndex: number): void {
    if (resources.totalFood <= 0) return;
    zoneStates[zoneIndex].overtime = !zoneStates[zoneIndex].overtime;
  }

  function handleSetRoomType(layerIndex: number, roomId: string, type: import('./data/PyramidModel').RoomType): void {
    const costs: Record<string, { cedar: number; hide: number; papyrus: number }> = {
      burial: { cedar: 3, hide: 2, papyrus: 1 },
      treasure: { cedar: 2, hide: 0, papyrus: 2 },
      trap: { cedar: 0, hide: 1, papyrus: 1 },
      storage: { cedar: 2, hide: 0, papyrus: 0 },
      shrine: { cedar: 5, hide: 3, papyrus: 3 },
    };
    const cost = costs[type];
    if (!cost) return;
    if (resources.cedar < cost.cedar || resources.hide < cost.hide || resources.papyrus < cost.papyrus) return;

    if (pyramidModel.setRoomType(layerIndex, roomId, type)) {
      resources.cedar -= cost.cedar;
      resources.hide -= cost.hide;
      resources.papyrus -= cost.papyrus;
      pyramidRenderer.redraw();
      pushToast(`${type === 'burial' ? '매장실' : type === 'treasure' ? '보물실' : type === 'trap' ? '함정실' : type === 'storage' ? '창고' : '신전'} 건설 완료!`, '🏛️', 'success');
    }
  }

  function handleAddDecoration(layerIndex: number, roomId: string, decorationId: string): void {
    const dec = DECORATIONS.find(d => d.id === decorationId);
    if (!dec) return;
    if (resources.cedar < dec.cost.cedar || resources.hide < dec.cost.hide ||
        resources.papyrus < dec.cost.papyrus || resources.gold < dec.cost.gold) return;

    if (pyramidModel.addDecoration(layerIndex, roomId, decorationId)) {
      resources.cedar -= dec.cost.cedar;
      resources.hide -= dec.cost.hide;
      resources.papyrus -= dec.cost.papyrus;
      resources.gold -= dec.cost.gold;
      pyramidRenderer.redraw();
      pushToast(`${dec.label} 설치 완료!`, dec.icon, 'success');
    }
  }

  function handleHireMercenary(mercId: string): void {
    const mercType = MERCENARY_TYPES.find(m => m.id === mercId);
    if (mercType) mercenarySystem.hire(world, mercType);
  }

  function handleRestart(): void {
    window.location.reload();
  }

  function handleSave(): void {
    const success = saveGame(resources, pyramidModel, dynasty, techTree, dayNight.dayCount);
    pushToast(success ? '저장 완료!' : '저장 실패', '💾', success ? 'success' : 'danger');
  }

  const showTutorial = !hasSave();

  function handleResearchTech(techId: string): void {
    const node = techTree.find(n => n.id === techId);
    if (!node || !canResearch(node, techTree, resources.ancientTech, resources.gold)) return;

    resources.ancientTech -= node.cost.ancientTech;
    resources.gold -= node.cost.gold;
    researchTech(techTree, techId);
    pushToast(`${node.name} 연구 완료!`, node.icon, 'success');
  }

  const uiRoot = document.getElementById('ui-overlay')!;
  render(
    h(App, {
      getState: getUIState,
      onSpawnUnit: spawnUnit,
      onToggleOvertime: handleToggleOvertime,
      onMerchantPurchase: (itemId: string) => merchantSystem.purchase(itemId),
      onSetRoomType: handleSetRoomType,
      onAddDecoration: handleAddDecoration,
      onResearchTech: handleResearchTech,
      onHireMercenary: handleHireMercenary,
      onRestart: handleRestart,
      onSave: handleSave,
      showTutorial,
    }),
    uiRoot,
  );

  // ---- Window resize ----
  window.addEventListener('resize', () => {
    camera.resize(window.innerWidth, window.innerHeight);
  });

  // ---- Start ----
  const gameLoop = new GameLoop(gameTick, gameRender);
  gameLoop.start();

  // Spawn some initial workers (only if no save loaded)
  if (!saveData) {
    for (let i = 0; i < 3; i++) {
      spawnUnit('worker');
    }
  }
}

// ---- Entry point: show main menu first, start game on click ----
import { MainMenu } from './ui/MainMenu';

function showMainMenu() {
  const uiRoot = document.getElementById('ui-overlay')!;
  const hasSaveData = hasSave();

  render(
    h(MainMenu, {
      hasSaveData,
      onStart: () => {
        render(null, uiRoot);
        startGame();
      },
    }),
    uiRoot,
  );
}

async function startGame() {
  try {
    await main();
  } catch (e) {
    console.error(e);
  }
}

showMainMenu();
