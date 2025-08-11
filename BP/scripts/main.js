import { world, system, Player, Entity } from "@minecraft/server";
import { Utility } from "./utility.js"; // Assuming Utility is in a separate file

// ========== OPTIMIZED CONSTANTS ========== //
const MIN_TICKS = 30 * 20;
const MAX_TICKS = 50 * 20;
const MAGMA_WALKER_COOLDOWN = 2;
const BIOME_CHECK_INTERVAL = 5 * 20;

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
    breeze: {
        effects: {
            base: [
                { effectId: "slow_falling", amplifier: 0 }
            ],
            mountain: [
                { effectId: "speed", amplifier: 1 },
                { effectId: "jump_boost", amplifier: 1 },
                { effectId: "resistance", amplifier: 0 }
            ]
        },
        launchChance: 0.3,
        levitationDuration: 40
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
        "arw:necklace_of_breeze"
    ]),
    mountainBiomes: new Set([
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

// Replaced with Utility.Getitem
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
        return block?.biomeId?.includes("jungle") || block?.biomeId?.includes("bamboo");
    } catch {
        return false;
    }
}

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
        strike.ticksLeft--;
        
        if (strike.ticksLeft <= 0) {
            try {
                const dimension = world.getDimension(strike.dimensionId);
                const target = dimension.getEntity(strike.targetId);

                if (target) {
                    dimension.spawnEntity("minecraft:lightning_bolt", target.location);
                    if (Math.random() < 0.10) {
                        target.applyDamage(1000, { cause: "magic" });
                    }
                }
            } catch (e) {
                // Ignore errors
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
                const dimension = world.getDimension(data.dimensionId);
                const block = dimension.getBlock(data.location);
                
                if (block?.typeId === "minecraft:basalt") {
                    block.setType("minecraft:lava");
                }
            } catch (e) {
                // Ignore errors
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
            timerData: { timer: 0, maxTime: getRandomTimer(), cursed: false, holding: false },
            biomeData: {
                lastCheck: 0,
                inJungle: false,
                inMountain: false
            },
            cooldowns: { magmaWalker: 0 }
        };
        playerStates.set(player.id, state);
    }
    return state;
}

// Updated to use Utility.Getitem
function updatePlayerEquipment(player, state) {
    state.equipment.mainHand = Utility.Getitem(player, "hand");
    state.equipment.offHand = Utility.Getitem(player, "offhand");
    return state.equipment;
}

// ========== NECKLACE EFFECTS ========== //
function applyJungleEffects(player, inJungle) {
    const effects = inJungle
        ? EFFECT_CONFIG.jungle.effects.jungle
        : EFFECT_CONFIG.jungle.effects.base;

    for (const effect of effects) {
        Utility.addEffect(player, `minecraft:${effect.effectId}`, 10, true, effect.amplifier);
    }
}

function applyBreezeEffects(player, inMountain) {
    for (const effect of EFFECT_CONFIG.breeze.effects.base) {
        Utility.addEffect(player, `minecraft:${effect.effectId}`, 10, true, effect.amplifier);
    }

    if (inMountain) {
        for (const effect of EFFECT_CONFIG.breeze.effects.mountain) {
            Utility.addEffect(player, `minecraft:${effect.effectId}`, 10, true, effect.amplifier);
        }
    }
}

function applyNecklaceEffects(player, state) {
    const { offHand } = state.equipment;

    if (offHand === "arw:necklace_of_jungle") {
        if (tickCounter - state.biomeData.lastCheck > BIOME_CHECK_INTERVAL) {
            state.biomeData.inJungle = isInJungleBiome(player);
            state.biomeData.lastCheck = tickCounter;
        }
        applyJungleEffects(player, state.biomeData.inJungle);
    }
    else if (offHand === "arw:necklace_of_magma") {
        for (const effect of EFFECT_CONFIG.magma.effects) {
            Utility.addEffect(player, `minecraft:${effect.effectId}`, 10, true, effect.amplifier);
        }
    }
    else if (offHand === "arw:necklace_of_immortality") {
        for (const effect of EFFECT_CONFIG.immortality.effects) {
            Utility.addEffect(player, `minecraft:${effect.effectId}`, 10, true, effect.amplifier);
        }

        try {
            const health = player.getComponent("minecraft:health");
            if (health && health.currentValue <= EFFECT_CONFIG.immortality.lowHealthThreshold) {
                Utility.addEffect(player, "minecraft:instant_health", 1, true, EFFECT_CONFIG.immortality.instantHealthAmplifier);
                Utility.addEffect(player, "minecraft:resistance", EFFECT_CONFIG.immortality.resistanceDuration, true, EFFECT_CONFIG.immortality.resistanceAmplifier);
            }
        } catch (e) {
            // Ignore errors
        }
    }
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

    if (ITEM_GROUPS.poleaxes.has(mainHand)) {
        Utility.addEffect(player, "minecraft:slowness", 10, true, offhandHasItem ? 2 : 0);
        if (offhandHasItem) {
            Utility.addEffect(player, "minecraft:weakness", 10, true, 1);
        }
    }
    else if (ITEM_GROUPS.katanas.has(mainHand)) {
        const effects = EFFECT_CONFIG.katanas[mainHand] || [];
        for (const effect of effects) {
            Utility.addEffect(player, `minecraft:${effect.effectId}`, 10, true, effect.amplifier);
        }
        if (offhandHasItem) {
            Utility.addEffect(player, "minecraft:weakness", 10, true, 2);
        }
    }
    else if (mainHand === "arw:sacrificial_dagger") {
        const timerData = state.timerData;
        if (!timerData.holding) {
            timerData.holding = true;
            timerData.timer = 0;
            timerData.maxTime = getRandomTimer();
        }

        if (++timerData.timer >= timerData.maxTime && !timerData.cursed) {
            Utility.addEffect(player, "minecraft:wither", 999999, true, 1);
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
system.runInterval(() => {
    tickCounter++;
    processScheduledLightning();
    processMagmaWalkerBlocks();

    for (const player of world.getAllPlayers()) {
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

            // Apply necklace effects
            if (ITEM_GROUPS.necklaces.has(equipment.offHand)) {
                applyNecklaceEffects(player, state);

                // Magma Walker
                if (equipment.offHand === "arw:necklace_of_magma") {
                    if (state.cooldowns.magmaWalker++ >= MAGMA_WALKER_COOLDOWN) {
                        state.cooldowns.magmaWalker = 0;
                        handleMagmaWalker(player);
                    }
                }
            }

            // Apply weapon effects
            applyWeaponEffects(player, state);
        } catch (e) {
            console.warn(`Error processing player ${player.name}: ${e}`);
        }
    }
}, 1);

world.afterEvents.entityHurt.subscribe(event => {
    try {
        const attacker = event.damageSource.damagingEntity;
        const target = event.hurtEntity;

        if (!attacker || !attacker.isPlayer || !target) return;

        const state = playerStates.get(attacker.id) || getPlayerState(attacker);
        const { mainHand, offHand } = state.equipment;

        // Amethyst Spear
        if (mainHand === "arw:amethyst_spear") {
            Utility.addEffect(target, "minecraft:weakness", EFFECT_CONFIG.amethystSpear.weaknessDuration, true, EFFECT_CONFIG.amethystSpear.weaknessAmplifier);

            if (Math.random() < EFFECT_CONFIG.amethystSpear.healthReductionChance) {
                try {
                    const health = target.getComponent("minecraft:health");
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

            Utility.addEffect(attacker, "minecraft:instant_health", 1, true, 0);
            target.applyDamage(4);
        }
        // Royal Kris
        else if (mainHand === "arw:royal_kris") {
            Utility.addEffect(attacker, "minecraft:speed", EFFECT_CONFIG.royalKris.speedDuration, true, 0);

            if (Math.random() < EFFECT_CONFIG.royalKris.weaknessChance) {
                Utility.addEffect(target, "minecraft:weakness", EFFECT_CONFIG.royalKris.weaknessDuration, true, 1);
            }

            Utility.addEffect(target, "minecraft:poison", EFFECT_CONFIG.royalKris.poisonDuration, true, 0);

            const strengthChance = offHand === "minecraft:air"
                ? EFFECT_CONFIG.royalKris.strengthChanceMainhand
                : EFFECT_CONFIG.royalKris.strengthChanceOffhand;

            if (Math.random() < strengthChance) {
                Utility.addEffect(attacker, "minecraft:strength", 100, true, 1);
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
                    Utility.addEffect(target, "minecraft:slowness", 100, true, 2);
                    Utility.addEffect(target, "minecraft:weakness", 100, true, 3);
                }

                if (Math.random() < 0.15) {
                    scheduledLightningStrikes.push({
                        targetId: target.id,
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
                Utility.addEffect(target, "minecraft:weakness", 60, true, 255);
                Utility.addEffect(target, "minecraft:slowness", 60, true, 255);

                try {
                    const equippable = attacker.getComponent("minecraft:equippable");
                    const offhandItem = equippable?.getEquipment("offhand");
                    if (offhandItem) {
                        Utility.reduceDurability(attacker, offhandItem, 5);
                    }
                } catch (e) {
                    // Ignore error
                }
            }
        }

        // Jungle Necklace Attack Effect
        if (offHand === "arw:necklace_of_jungle") {
            const venomDuration = state.biomeData.inJungle
                ? EFFECT_CONFIG.jungle.venomDuration
                : 50;
            Utility.addEffect(target, "minecraft:poison", venomDuration, true, 0);
        }

        // Breeze Necklace Attack Effect
        if (offHand === "arw:necklace_of_breeze") {
            if (Math.random() < EFFECT_CONFIG.breeze.launchChance) {
                Utility.addEffect(target, "minecraft:levitation", EFFECT_CONFIG.breeze.levitationDuration, true, 0);
            }
        }
    } catch (e) {
        console.warn(`Error in entityHurt event: ${e}`);
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
        console.warn(`Magma Walker error: ${e}`);
    }
}