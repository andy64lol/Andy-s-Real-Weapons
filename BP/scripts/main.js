import { world, system } from "@minecraft/server";

// ========== OPTIMIZED CONSTANTS ========== //
const MIN_TICKS = 30 * 20;
const MAX_TICKS = 50 * 20;
const MAGMA_WALKER_COOLDOWN = 40; // Changed to ticks (2 seconds)
const BIOME_CHECK_INTERVAL = 5 * 20;
const DEBUG = true;

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

// ========== HELPER FUNCTIONS ========== //
function log(...msg) { 
    if (DEBUG && typeof console !== "undefined") {
        console.warn(...msg); 
    }
}

function getRandomTimer() {
    return MIN_TICKS + Math.floor(Math.random() * (MAX_TICKS - MIN_TICKS + 1));
}

function updateBiomeState(player, state) {
    if (tickCounter - state.biomeData.lastCheck >= BIOME_CHECK_INTERVAL) {
        try {
            const block = player.dimension.getBlock(player.location);
            state.biomeData.inJungle = block?.biomeId?.includes("jungle") || 
                                       block?.biomeId?.includes("bamboo");
            state.biomeData.inMountain = ITEM_GROUPS.mountainBiomes.has(block?.biomeId);
            state.biomeData.lastCheck = tickCounter;
        } catch (e) {
            log(`Biome check error: ${e}`);
        }
    }
}

// ========== TICK HANDLERS ========== //
function highFrequencyTasks() {
    tickCounter++;
    processScheduledLightning();
    
    for (const player of world.getAllPlayers()) {
        try {
            const state = getPlayerState(player);
            updatePlayerEquipment(player, state);
            
            // Shogun Katana theme handling
            const { mainHand } = state.equipment;
            if (mainHand === "arw:shogun_katana" && !shogunKatanaPlayers.has(player.id)) {
                player.playSound("arw.shogun_theme");
                shogunKatanaPlayers.add(player.id);
            } else if (mainHand !== "arw:shogun_katana") {
                shogunKatanaPlayers.delete(player.id);
            }

            // Magma Walker ability
            if (state.equipment.offHand === "arw:necklace_of_magma") {
                if (state.cooldowns.magmaWalker <= 0) {
                    handleMagmaWalker(player);
                    state.cooldowns.magmaWalker = MAGMA_WALKER_COOLDOWN;
                } else {
                    state.cooldowns.magmaWalker--;
                }
            }
        } catch (e) {
            log(`HighFreq error: ${e}`);
        }
    }
}

function lowFrequencyTasks() {
    processMagmaWalkerBlocks();
    
    for (const player of world.getAllPlayers()) {
        try {
            const state = getPlayerState(player);
            updateBiomeState(player, state);
            applyNecklaceEffects(player, state);
            applyWeaponEffects(player, state);
        } catch (e) {
            log(`LowFreq error: ${e}`);
        }
    }
}

// Initialize tick handlers
system.runInterval(highFrequencyTasks, 1);
system.runInterval(lowFrequencyTasks, 100); // 5s interval

// ========== EVENT HANDLERS ========== //
world.afterEvents.entityHurt.subscribe(handleEntityHurt);
world.afterEvents.playerLeave.subscribe(cleanPlayerState);

function handleEntityHurt(event) {
    try {
        const attacker = event.damageSource.damagingEntity;
        const target = event.hurtEntity;

        if (!attacker || !attacker.isPlayer || !target) return;

        const state = playerStates.get(attacker.id) || getPlayerState(attacker);
        const { mainHand, offHand } = state.equipment;

        // Amethyst Spear
        if (mainHand === "arw:amethyst_spear") {
            target.addEffect("minecraft:weakness", EFFECT_CONFIG.amethystSpear.weaknessDuration, { 
                showParticles: true, 
                amplifier: EFFECT_CONFIG.amethystSpear.weaknessAmplifier 
            });

            if (Math.random() < EFFECT_CONFIG.amethystSpear.healthReductionChance) {
                try {
                    const health = target.getComponent("minecraft:health");
                    if (health) {
                        health.setCurrentValue(Math.max(1, health.currentValue - 
                            EFFECT_CONFIG.amethystSpear.healthReductionAmount));
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

            attacker.addEffect("minecraft:instant_health", 1, { 
                showParticles: true, 
                amplifier: 0 
            });
            target.applyDamage(4);
        }
        // Royal Kris
        else if (mainHand === "arw:royal_kris") {
            attacker.addEffect("minecraft:speed", EFFECT_CONFIG.royalKris.speedDuration, { 
                showParticles: true, 
                amplifier: 0 
            });

            if (Math.random() < EFFECT_CONFIG.royalKris.weaknessChance) {
                target.addEffect("minecraft:weakness", EFFECT_CONFIG.royalKris.weaknessDuration, { 
                    showParticles: true, 
                    amplifier: 1 
                });
            }

            target.addEffect("minecraft:poison", EFFECT_CONFIG.royalKris.poisonDuration, { 
                showParticles: true, 
                amplifier: 0 
            });

            const strengthChance = offHand === "minecraft:air"
                ? EFFECT_CONFIG.royalKris.strengthChanceMainhand
                : EFFECT_CONFIG.royalKris.strengthChanceOffhand;

            if (Math.random() < strengthChance) {
                attacker.addEffect("minecraft:strength", 100, { 
                    showParticles: true, 
                    amplifier: 1 
                });
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
                    target.addEffect("minecraft:slowness", 100, { 
                        showParticles: true, 
                        amplifier: 2 
                    });
                    target.addEffect("minecraft:weakness", 100, { 
                        showParticles: true, 
                        amplifier: 3 
                    });
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
                target.addEffect("minecraft:weakness", 60, { 
                    showParticles: true, 
                    amplifier: 255 
                });
                target.addEffect("minecraft:slowness", 60, { 
                    showParticles: true, 
                    amplifier: 255 
                });

                try {
                    const equippable = attacker.getComponent("minecraft:equippable");
                    const offhandItem = equippable?.getEquipment("offhand");
                    if (offhandItem) {
                        const dur = offhandItem.getComponent('durability');
                        const RemainingDurability = dur.maxDurability - dur.damage;
                        if (RemainingDurability > 0) {
                            dur.damage += 5;
                            equippable.setEquipment("offhand", offhandItem);
                        } else {
                            equippable.setEquipment("offhand", undefined);
                        }
                    }
                } catch (e) {
                    log(`Jade Daga error: ${e}`);
                }
            }
        }

        // Jungle Necklace Attack Effect
        if (offHand === "arw:necklace_of_jungle") {
            const venomDuration = state.biomeData.inJungle
                ? EFFECT_CONFIG.jungle.venomDuration
                : 50;
            target.addEffect("minecraft:poison", venomDuration, { 
                showParticles: true, 
                amplifier: 0 
            });
        }

        // Breeze Necklace Attack Effect
        if (offHand === "arw:necklace_of_breeze") {
            if (Math.random() < EFFECT_CONFIG.breeze.launchChance) {
                target.addEffect("minecraft:levitation", EFFECT_CONFIG.breeze.levitationDuration, { 
                    showParticles: true, 
                    amplifier: 0 
                });
            }
        }
    } catch (e) {
        log(`EntityHurt error: ${e}`);
    }
}

function cleanPlayerState({ playerId }) {
    playerStates.delete(playerId);
    shogunKatanaPlayers.delete(playerId);
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

function updatePlayerEquipment(player, state) {
    try {
        const equipment = player.getComponent("equippable");
        state.equipment.mainHand = equipment.getEquipment("Mainhand")?.typeId || "minecraft:air";
        state.equipment.offHand = equipment.getEquipment("Offhand")?.typeId || "minecraft:air";
        
        // Reset cooldowns when unequipped
        if (state.equipment.offHand !== "arw:necklace_of_magma") {
            state.cooldowns.magmaWalker = 0;
        }
        return state.equipment;
    } catch (e) {
        log(`Equipment error: ${e}`);
        return state.equipment;
    }
}

// ========== NECKLACE EFFECTS ========== //
function applyJungleEffects(player, inJungle) {
    const effects = inJungle
        ? EFFECT_CONFIG.jungle.effects.jungle
        : EFFECT_CONFIG.jungle.effects.base;

    for (const effect of effects) {
        player.addEffect(`minecraft:${effect.effectId}`, 10, { 
            showParticles: true, 
            amplifier: effect.amplifier 
        });
    }
}

function applyBreezeEffects(player, inMountain) {
    for (const effect of EFFECT_CONFIG.breeze.effects.base) {
        player.addEffect(`minecraft:${effect.effectId}`, 10, { 
            showParticles: true, 
            amplifier: effect.amplifier 
        });
    }

    if (inMountain) {
        for (const effect of EFFECT_CONFIG.breeze.effects.mountain) {
            player.addEffect(`minecraft:${effect.effectId}`, 10, { 
                showParticles: true, 
                amplifier: effect.amplifier 
            });
        }
    }
}

function applyNecklaceEffects(player, state) {
    const { offHand } = state.equipment;

    if (offHand === "arw:necklace_of_jungle") {
        applyJungleEffects(player, state.biomeData.inJungle);
    }
    else if (offHand === "arw:necklace_of_magma") {
        for (const effect of EFFECT_CONFIG.magma.effects) {
            player.addEffect(`minecraft:${effect.effectId}`, 10, { 
                showParticles: true, 
                amplifier: effect.amplifier 
            });
        }
    }
    else if (offHand === "arw:necklace_of_immortality") {
        for (const effect of EFFECT_CONFIG.immortality.effects) {
            player.addEffect(`minecraft:${effect.effectId}`, 10, { 
                showParticles: true, 
                amplifier: effect.amplifier 
            });
        }

        try {
            const health = player.getComponent("minecraft:health");
            if (health && health.currentValue <= EFFECT_CONFIG.immortality.lowHealthThreshold) {
                player.addEffect("minecraft:instant_health", 1, { 
                    showParticles: true, 
                    amplifier: EFFECT_CONFIG.immortality.instantHealthAmplifier 
                });
                player.addEffect("minecraft:resistance", EFFECT_CONFIG.immortality.resistanceDuration, { 
                    showParticles: true, 
                    amplifier: EFFECT_CONFIG.immortality.resistanceAmplifier 
                });
            }
        } catch (e) {
            log(`Immortality error: ${e}`);
        }
    }
    else if (offHand === "arw:necklace_of_breeze") {
        applyBreezeEffects(player, state.biomeData.inMountain);
    }
}

// ========== WEAPON EFFECTS ========== //
function applyWeaponEffects(player, state) {
    const { mainHand, offHand } = state.equipment;
    const offhandHasItem = offHand !== "minecraft:air";

    if (ITEM_GROUPS.poleaxes.has(mainHand)) {
        player.addEffect("minecraft:slowness", 10, { 
            showParticles: true, 
            amplifier: offhandHasItem ? 2 : 0 
        });
        if (offhandHasItem) {
            player.addEffect("minecraft:weakness", 10, { 
                showParticles: true, 
                amplifier: 1 
            });
        }
    }
    else if (ITEM_GROUPS.katanas.has(mainHand)) {
        const effects = EFFECT_CONFIG.katanas[mainHand] || [];
        for (const effect of effects) {
            player.addEffect(`minecraft:${effect.effectId}`, 10, { 
                showParticles: true, 
                amplifier: effect.amplifier 
            });
        }
        if (offhandHasItem) {
            player.addEffect("minecraft:weakness", 10, { 
                showParticles: true, 
                amplifier: 2 
            });
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
            player.addEffect("minecraft:wither", 999999, { 
                showParticles: true, 
                amplifier: 1 
            });
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

// ========== SCHEDULED EFFECT PROCESSORS ========== //
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
                log(`Lightning error: ${e}`);
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
                log(`MagmaWalker revert error: ${e}`);
            } finally {
                magmaWalkerBlocks.delete(key);
            }
        }
    }
}

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
        log(`MagmaWalker error: ${e}`);
    }
}