import { world, system } from "@minecraft/server";

// ========== OPTIMIZED CONSTANTS ========== //
const MIN_TICKS = 30 * 20;
const MAX_TICKS = 50 * 20;
const MAGMA_WALKER_COOLDOWN = 2;
const BIOME_CHECK_INTERVAL = 5 * 20;

const WITHER_EFFECT = {
    effectId: "minecraft:wither",
    duration: 999999,
    amplifier: 1
};

// Consolidated effect configurations
const EFFECT_CONFIG = {
    // Weapons
    amethystSpear: {
        weaknessDuration: 100,
        weaknessAmplifier: 1,
        healthReductionChance: 0.4,
        healthReductionAmount: 6
    },
    royalKris: {
        speedDuration: 100,
        weaknessChance: 0.6,
        weaknessDuration: 80,
        poisonDuration: 160,
        strengthChanceMainhand: 0.7,
        strengthChanceOffhand: 0.3
    },

    // Necklaces
    jungle: {
        effects: {
            base: [
                { effectId: "speed", amplifier: 0 },
                { effectId: "jump_boost", amplifier: 0 }
            ],
            jungle: [
                { effectId: "speed", amplifier: 2 },
                { effectId: "jump_boost", amplifier: 2 },
                { effectId: "slow_falling", amplifier: 3 },
                { effectId: "night_vision", amplifier: 0 }
            ]
        },
        venomDuration: 100
    },
    magma: {
        effects: [
            { effectId: "fire_resistance", amplifier: 0 },
            { effectId: "resistance", amplifier: 1 }
        ],
        regenDuration: 10
    },
    immortality: {
        effects: [
            { effectId: "health_boost", amplifier: 3 }
        ],
        resistanceDuration: 100,
        resistanceAmplifier: 2,
        instantHealthAmplifier: 3,
        lowHealthThreshold: 3
    },
    breeze: { // NEW: Breeze Necklace configuration
        effects: {
            base: [
                { effectId: "slow_falling", amplifier: 0 } // Permanent slow falling
            ],
            mountain: [
                { effectId: "speed", amplifier: 1 }, // Speed II
                { effectId: "jump_boost", amplifier: 1 }, // Jump Boost II
                { effectId: "resistance", amplifier: 0 } // Resistance I
            ]
        },
        launchChance: 0.3, // 30% chance to launch target
        levitationDuration: 40 // 2 seconds (40 ticks)
    },

    // Katanas
    katanas: {
        "arw:diamond_katana": [
            { effectId: "hunger", amplifier: 1 },
            { effectId: "speed", amplifier: 1 },
            { effectId: "jump_boost", amplifier: 1 }
        ],
        "arw:steel_katana": [
            { effectId: "speed", amplifier: 2 },
            { effectId: "jump_boost", amplifier: 1 }
        ],
        "arw:iron_katana": [
            { effectId: "hunger", amplifier: 0 },
            { effectId: "speed", amplifier: 0 }
        ]
    }
};

// Predefined item lists
const ITEM_GROUPS = {
    poleaxes: new Set(["arw:steel_poleaxe", "arw:netherite_poleaxe"]),
    katanas: new Set(["arw:diamond_katana", "arw:steel_katana", "arw:iron_katana"]),
    excludedWeapons: new Set([
        "arw:sacrificial_dagger", "arw:steel_poleaxe", "arw:netherite_poleaxe",
        "arw:amethyst_spear", "arw:royal_kris"
    ]),
    allowedWeapons: new Set([
        "minecraft:wooden_sword", "minecraft:stone_sword", "minecraft:iron_sword",
        "minecraft:golden_sword", "minecraft:diamond_sword", "minecraft:netherite_sword",
        "arw:jade_daga", "arw:flint_daga", "arw:iron_daga", "arw:gold_daga", "arw:netherite_daga"
    ]),
    necklaces: new Set([
        "arw:necklace_of_jungle",
        "arw:necklace_of_magma",
        "arw:necklace_of_immortality",
        "arw:necklace_of_breeze" // NEW: Added Breeze Necklace
    ]),
    mountainBiomes: new Set([ // NEW: Mountain biome identifiers
        "minecraft:windswept_hills",
        "minecraft:windswept_gravelly_hills",
        "minecraft:windswept_forest",
        "minecraft:stony_peaks",
        "minecraft:jagged_peaks",
        "minecraft:frozen_peaks",
        "minecraft:snowy_slopes",
        "minecraft:meadow"
    ])
};

// ========== STATE TRACKERS ========== //
const playerStates = new Map();
const scheduledLightningStrikes = [];
const shogunKatanaPlayers = new Set();
const magmaWalkerBlocks = new Map();
let tickCounter = 0;

// ========== OPTIMIZED HELPER FUNCTIONS ========== //
function getRandomTimer() {
    return MIN_TICKS + Math.floor(Math.random() * (MAX_TICKS - MIN_TICKS + 1));
}

function getEquipment(player, slot) {
    try {
        return player.getComponent("equippable")?.getEquipment(slot)?.typeId || "";
    } catch {
        return "";
    }
}

function applyEffectSafe(player, effectId, duration = 10, amplifier = 0) {
    try {
        player.addEffect(effectId, duration, { amplifier });
        return true;
    } catch (e) {
        return false;
    }
}

function isInJungleBiome(player) {
    try {
        const block = player.dimension.getBlock(player.location);
        const biome = block?.biomeId;
        return biome && (biome.includes("jungle") || biome.includes("bamboo"));
    } catch {
        return false;
    }
}

// NEW: Mountain biome detection for Breeze Necklace
function isInMountainBiome(player) {
    try {
        const block = player.dimension.getBlock(player.location);
        return block?.biomeId && ITEM_GROUPS.mountainBiomes.has(block.biomeId);
    } catch {
        return false;
    }
}

// ========== OPTIMIZED EVENT PROCESSORS ========== //
function processScheduledLightning() {
    for (let i = scheduledLightningStrikes.length - 1; i >= 0; i--) {
        const strike = scheduledLightningStrikes[i];
        if (--strike.ticksLeft <= 0) {
            try {
                const dimension = world.getDimension(strike.dimensionId);
                const target = dimension.getEntity(strike.targetId);

                if (target) {
                    dimension.spawnEntity("minecraft:lightning_bolt", target.location);
                    if (Math.random() < 0.10) {
                        target.applyDamage(1000, { cause: "magic" });
                    }
                }
            } finally {
                scheduledLightningStrikes.splice(i, 1);
            }
        }
    }
}

function processMagmaWalkerBlocks() {
    const currentTime = Date.now();
    for (const [key, data] of magmaWalkerBlocks) {
        if (currentTime >= data.expireTime) {
            try {
                const block = world.getDimension(data.dimensionId).getBlock(data.location);
                if (block?.typeId === "minecraft:basalt") {
                    block.setType("minecraft:lava");
                }
            } finally {
                magmaWalkerBlocks.delete(key);
            }
        }
    }
}

// ========== PLAYER STATE MANAGEMENT ========== //
function getPlayerState(player) {
    let state = playerStates.get(player.id);
    if (!state) {
        state = {
            equipment: { mainHand: "", offHand: "" },
            timerData: { timer: 0, maxTime: getRandomTimer(), cursed: false },
            biomeData: {
                lastCheck: 0,
                inJungle: false,
                inMountain: false // NEW: Mountain biome state
            },
            cooldowns: { magmaWalker: 0 }
        };
        playerStates.set(player.id, state);
    }
    return state;
}

function updatePlayerEquipment(player, state) {
    state.equipment.mainHand = getEquipment(player, "mainhand");
    state.equipment.offHand = getEquipment(player, "offhand");
    return state.equipment;
}

// ========== NECKLACE EFFECTS ========== //
function applyJungleEffects(player, inJungle) {
    const effects = inJungle
        ? EFFECT_CONFIG.jungle.effects.jungle
        : EFFECT_CONFIG.jungle.effects.base;

    for (const effect of effects) {
        applyEffectSafe(player, `minecraft:${effect.effectId}`, 10, effect.amplifier);
    }
}

// NEW: Breeze Necklace effects
function applyBreezeEffects(player, inMountain) {
    // Always apply slow falling
    for (const effect of EFFECT_CONFIG.breeze.effects.base) {
        applyEffectSafe(player, `minecraft:${effect.effectId}`, 10, effect.amplifier);
    }

    // Apply mountain bonuses if in mountain biome
    if (inMountain) {
        for (const effect of EFFECT_CONFIG.breeze.effects.mountain) {
            applyEffectSafe(player, `minecraft:${effect.effectId}`, 10, effect.amplifier);
        }
    }
}

function applyNecklaceEffects(player, state) {
    const { offHand } = state.equipment;

    // Jungle Necklace
    if (offHand === "arw:necklace_of_jungle") {
        if (tickCounter - state.biomeData.lastCheck > BIOME_CHECK_INTERVAL) {
            state.biomeData.inJungle = isInJungleBiome(player);
            state.biomeData.lastCheck = tickCounter;
        }
        applyJungleEffects(player, state.biomeData.inJungle);
    }

    // Magma Necklace
    else if (offHand === "arw:necklace_of_magma") {
        for (const effect of EFFECT_CONFIG.magma.effects) {
            applyEffectSafe(player, `minecraft:${effect.effectId}`, 10, effect.amplifier);
        }
        if (player.hasEffect("fire")) {
            applyEffectSafe(player, "minecraft:regeneration", EFFECT_CONFIG.magma.regenDuration);
        }
    }

    // Immortality Necklace
    else if (offHand === "arw:necklace_of_immortality") {
        for (const effect of EFFECT_CONFIG.immortality.effects) {
            applyEffectSafe(player, `minecraft:${effect.effectId}`, 10, effect.amplifier);
        }

        const health = player.getComponent("health");
        if (health?.currentValue <= EFFECT_CONFIG.immortality.lowHealthThreshold) {
            applyEffectSafe(player, "minecraft:instant_health", 1, EFFECT_CONFIG.immortality.instantHealthAmplifier);
            applyEffectSafe(player, "minecraft:resistance", EFFECT_CONFIG.immortality.resistanceDuration, EFFECT_CONFIG.immortality.resistanceAmplifier);
        }
    }

    // NEW: Breeze Necklace
    else if (offHand === "arw:necklace_of_breeze") {
        if (tickCounter - state.biomeData.lastCheck > BIOME_CHECK_INTERVAL) {
            state.biomeData.inMountain = isInMountainBiome(player);
            state.biomeData.lastCheck = tickCounter;
        }
        applyBreezeEffects(player, state.biomeData.inMountain);
    }
}

// ========== WEAPON EFFECTS ========== //
function applyWeaponEffects(player, state) {
    const { mainHand, offHand } = state.equipment;
    const offhandHasItem = offHand !== "minecraft:air";

    // Poleaxe Effects
    if (ITEM_GROUPS.poleaxes.has(mainHand)) {
        applyEffectSafe(player, "minecraft:slowness", 10, offhandHasItem ? 2 : 0);
        if (offhandHasItem) {
            applyEffectSafe(player, "minecraft:weakness", 10, 1);
        }
    }

    // Katana Effects
    else if (ITEM_GROUPS.katanas.has(mainHand)) {
        const effects = EFFECT_CONFIG.katanas[mainHand] || [];
        for (const effect of effects) {
            applyEffectSafe(player, `minecraft:${effect.effectId}`, 10, effect.amplifier);
        }
        if (offhandHasItem) {
            applyEffectSafe(player, "minecraft:weakness", 10, 2);
        }
    }

    // Sacrificial Dagger Logic
    else if (mainHand === "arw:sacrificial_dagger") {
        const timerData = state.timerData;
        if (!timerData.holding) {
            timerData.holding = true;
            timerData.timer = 0;
            timerData.maxTime = getRandomTimer();
        }

        if (++timerData.timer >= timerData.maxTime && !timerData.cursed) {
            applyEffectSafe(player, "minecraft:wither", 999999, 1);
            timerData.cursed = true;
        }
    }
    else if (state.timerData.holding) {
        if (state.timerData.cursed) {
            player.removeEffect("wither");
        }
        state.timerData.holding = false;
        state.timerData.cursed = false;
    }
}

// ========== EVENT HANDLERS ========== //
world.events.tick.subscribe(() => {
    tickCounter++;
    processScheduledLightning();
    processMagmaWalkerBlocks();

    const players = world.getPlayers();
    for (const player of players) {
        try {
            const state = getPlayerState(player);
            const equipment = updatePlayerEquipment(player, state);

            // Shogun Katana Theme
            if (equipment.mainHand === "arw:shogun_katana") {
                if (!shogunKatanaPlayers.has(player.id)) {
                    player.playSound("arw.shogun_theme");
                    shogunKatanaPlayers.add(player.id);
                }
            } else {
                shogunKatanaPlayers.delete(player.id);
            }

            // Apply effects only if holding relevant items
            if (ITEM_GROUPS.necklaces.has(equipment.offHand)) {
                applyNecklaceEffects(player, state);

                // Magma Walker (with cooldown)
                if (equipment.offHand === "arw:necklace_of_magma") {
                    if (state.cooldowns.magmaWalker++ >= MAGMA_WALKER_COOLDOWN) {
                        state.cooldowns.magmaWalker = 0;
                        handleMagmaWalker(player);
                    }
                }
            }

            applyWeaponEffects(player, state);

        } catch (e) {
            // Suppress individual player errors
        }
    }
});

world.afterEvents.entityHurt.subscribe(event => {
    const attacker = event.damageSource.damagingEntity;
    const target = event.hurtEntity;

    if (!attacker?.isPlayer() || !target) return;

    const state = playerStates.get(attacker.id) || getPlayerState(attacker);
    const { mainHand, offHand } = state.equipment;

    // Amethyst Spear
    if (mainHand === "arw:amethyst_spear") {
        applyEffectSafe(target, "minecraft:weakness", EFFECT_CONFIG.amethystSpear.weaknessDuration, EFFECT_CONFIG.amethystSpear.weaknessAmplifier);

        if (Math.random() < EFFECT_CONFIG.amethystSpear.healthReductionChance) {
            try {
                const health = target.getComponent("health");
                if (health) {
                    health.setCurrentValue(Math.max(1, health.currentValue - EFFECT_CONFIG.amethystSpear.healthReductionAmount));
                }
            } catch {
                target.applyDamage(EFFECT_CONFIG.amethystSpear.healthReductionAmount);
            }
        }
    }

    // Sacrificial Dagger
    else if (mainHand === "arw:sacrificial_dagger") {
        if (state.timerData.cursed) {
            attacker.removeEffect("wither");
            state.timerData.cursed = false;
        }
        state.timerData.timer = 0;
        state.timerData.maxTime = getRandomTimer();

        applyEffectSafe(attacker, "minecraft:instant_health", 1);
        target.applyDamage(4);
    }

    // Royal Kris
    else if (mainHand === "arw:royal_kris") {
        applyEffectSafe(attacker, "minecraft:speed", EFFECT_CONFIG.royalKris.speedDuration);

        if (Math.random() < EFFECT_CONFIG.royalKris.weaknessChance) {
            applyEffectSafe(target, "minecraft:weakness", EFFECT_CONFIG.royalKris.weaknessDuration, 1);
        }

        applyEffectSafe(target, "minecraft:poison", EFFECT_CONFIG.royalKris.poisonDuration);

        const strengthChance = offHand === "minecraft:air"
            ? EFFECT_CONFIG.royalKris.strengthChanceMainhand
            : EFFECT_CONFIG.royalKris.strengthChanceOffhand;

        if (Math.random() < strengthChance) {
            applyEffectSafe(attacker, "minecraft:strength", 100, 1);
        }
    }

    // Poleaxe Knockback
    else if (ITEM_GROUPS.poleaxes.has(mainHand)) {
        const direction = attacker.getViewDirection();
        target.applyKnockback(direction.x, direction.z, 1.5, 0.5);
    }

    // Shogun Katana
    else if (mainHand === "arw:shogun_katana") {
        const offhandEmpty = offHand === "minecraft:air";

        if (offhandEmpty) {
            if (Math.random() < 0.8) {
                applyEffectSafe(target, "minecraft:slowness", 100, 2);
                applyEffectSafe(target, "minecraft:weakness", 100, 3);
            }

            if (Math.random() < 0.15) {
                scheduledLightningStrikes.push({
                    targetId: target.id,
                    attacker,
                    dimensionId: target.dimension.id,
                    ticksLeft: 100
                });
            }
        }

        const direction = attacker.getViewDirection();
        target.applyKnockback(direction.x, direction.z, 1.125, 0.5);
    }

    // Jade Daga Offhand
    else if (offHand === "arw:jade_daga" && mainHand && mainHand !== "minecraft:air") {
        if (ITEM_GROUPS.allowedWeapons.has(mainHand) && Math.random() < 0.10) {
            applyEffectSafe(target, "minecraft:weakness", 60, 255);
            applyEffectSafe(target, "minecraft:slowness", 60, 255);

            try {
                const offhandItem = attacker.getComponent("equippable")?.getEquipment("offhand");
                if (offhandItem) {
                    offhandItem.setDamageValue(offhandItem.getDamage() + 5);
                }
            } catch (e) {
                // Suppress error
            }
        }
    }

    // Jungle Necklace Attack Effect
    if (offHand === "arw:necklace_of_jungle") {
        const venomDuration = state.biomeData.inJungle
            ? EFFECT_CONFIG.jungle.venomDuration
            : 50;
        applyEffectSafe(target, "minecraft:poison", venomDuration);
    }

    // NEW: Breeze Necklace Attack Effect
    if (offHand === "arw:necklace_of_breeze") {
        if (Math.random() < EFFECT_CONFIG.breeze.launchChance) {
            applyEffectSafe(target, "minecraft:levitation", EFFECT_CONFIG.breeze.levitationDuration, 0);
        }
    }
});

// ========== MAGMA WALKER FUNCTION ========== //
function handleMagmaWalker(player) {
    try {
        const dimension = player.dimension;
        const loc = player.location;
        const y = Math.floor(loc.y) - 1;

        for (let x = Math.floor(loc.x) - 2; x <= Math.floor(loc.x) + 2; x++) {
            for (let z = Math.floor(loc.z) - 2; z <= Math.floor(loc.z) + 2; z++) {
                const blockLoc = { x, y, z };
                const block = dimension.getBlock(blockLoc);

                if (block?.typeId === "minecraft:lava") {
                    block.setType("minecraft:basalt");
                    const blockKey = `${x},${y},${z},${dimension.id}`;
                    magmaWalkerBlocks.set(blockKey, {
                        location: blockLoc,
                        dimensionId: dimension.id,
                        expireTime: Date.now() + 10000
                    });
                }
            }
        }
    } catch (e) {
        // Suppress error
    }
}