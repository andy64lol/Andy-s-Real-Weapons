import { world, system } from "@minecraft/server";

// Constants
const MIN_TICKS = 30 * 20; // 30 seconds minimum timer
const MAX_TICKS = 50 * 20; // 50 seconds maximum timer

const WITHER_EFFECT = {
	effectId: "minecraft:wither",
	duration: 999999,
	amplifier: 1
};

// Weapon-specific constants
const AMETHYST_SPEAR_EFFECTS = {
	weaknessDuration: 100, // 5 seconds
	weaknessAmplifier: 1,  // Weakness II
	healthReductionChance: 0.4,
	healthReductionAmount: 6 // 3 hearts
};

// Necklace-specific constants
const NECKLACE_EFFECTS = {
	jungle: {
		speedBase: 0,
		jumpBase: 0,
		speedJungle: 2,
		jumpJungle: 2,
		slowFallingJungle: 3,
		venomChance: 1.0,
		venomDuration: 100,
		nightVisionDuration: 200
	},
	magma: {
		fireResistanceDuration: 10,
		resistanceDuration: 10,
		resistanceAmplifier: 1,
		regenDuration: 10,
		regenAmplifier: 0
	},
	immortality: {
		healthBoostDuration: 10,
		healthBoostAmplifier: 3,
		resistanceDuration: 100,
		resistanceAmplifier: 2,
		instantHealthAmplifier: 3,
		lowHealthThreshold: 3
	}
};

// State trackers
const playersWithTimer = new Map();
const scheduledLightningStrikes = [];
const shogunKatanaPlayers = new Set();
const magmaWalkerBlocks = new Map();

// Helper Functions
function getRandomTimer() {
	return Math.floor(Math.random() * (MAX_TICKS - MIN_TICKS + 1)) + MIN_TICKS;
}

function getMainHandTypeId(player) {
	try {
		const equipment = player.getComponent("minecraft:equipment");
		return equipment?.getEquipment("mainhand")?.typeId || "";
	} catch {
		return "";
	}
}

function getOffHandTypeId(player) {
	try {
		const equipment = player.getComponent("minecraft:equipment");
		return equipment?.getEquipment("offhand")?.typeId || "";
	} catch {
		return "";
	}
}

function isHoldingItem(player, id) {
	return getMainHandTypeId(player) === id;
}

function isHoldingSacrificialDagger(player) {
	return isHoldingItem(player, "arw:sacrificial_dagger");
}

function isHoldingPoleaxe(player) {
	const id = getMainHandTypeId(player);
	return id === "arw:steel_poleaxe" || id === "arw:netherite_poleaxe";
}

function isHoldingKatana(player) {
	const id = getMainHandTypeId(player);
	return id === "arw:diamond_katana" ||
		id === "arw:steel_katana" ||
		id === "arw:iron_katana";
}

function isHoldingShogunKatana(player) {
	return getMainHandTypeId(player) === "arw:shogun_katana";
}

function isHoldingAmethystSpear(player) {
	return getMainHandTypeId(player) === "arw:amethyst_spear";
}

function isHoldingNecklaceOfJungle(player) {
	return getOffHandTypeId(player) === "arw:necklace_of_jungle";
}

function isHoldingNecklaceOfMagma(player) {
	return getOffHandTypeId(player) === "arw:necklace_of_magma";
}

function isHoldingNecklaceOfImmortality(player) {
	return getOffHandTypeId(player) === "arw:necklace_of_immortality";
}

function isInJungleBiome(player) {
	try {
		const dimension = world.getDimension(player.dimension.id);
		const block = dimension.getBlock(player.location);
		if (!block) return false;
		
		// Check for jungle biome variants
		const biome = block.biomeId;
		return biome && (
			biome.includes("jungle") || 
			biome.includes("bamboo") || 
			biome.includes("sparse_jungle")
		);
	} catch {
		return false;
	}
}

function applyNecklaceEffects(player) {
	try {
		// Necklace of Immortality - Health boost and emergency healing
		if (isHoldingNecklaceOfImmortality(player)) {
			player.addEffect({
				effectId: "minecraft:health_boost",
				duration: 10,
				amplifier: 3
			});
			
			const health = player.getComponent('health');
			if (health && health.currentValue <= NECKLACE_EFFECTS.immortality.lowHealthThreshold) {
				player.addEffect({
					effectId: "minecraft:instant_health",
					duration: 1,
					amplifier: 3
				});
				player.addEffect({
					effectId: "minecraft:resistance",
					duration: 100,
					amplifier: 2
				});
				player.sendMessage("[ARW] Immortality necklace saved you from death!");
			}
		}
		
		// Necklace of Magma - Fire immunity and lava walking
		if (isHoldingNecklaceOfMagma(player)) {
			player.addEffect({
				effectId: "minecraft:fire_resistance",
				duration: 10,
				amplifier: 0
			});
			
			player.addEffect({
				effectId: "minecraft:resistance",
				duration: 10,
				amplifier: 1
			});
			
			// Regeneration when burning
			if (player.hasEffect("minecraft:on_fire")) {
				player.addEffect({
					effectId: "minecraft:regeneration",
					duration: 10,
					amplifier: 0
				});
			}
		}
		
		// Necklace of Jungle - Biome-based effects
		if (isHoldingNecklaceOfJungle(player)) {
			const inJungle = isInJungleBiome(player);
			
			if (inJungle) {
				// Enhanced effects in jungle
				player.addEffect({
					effectId: "minecraft:speed",
					duration: 10,
					amplifier: 2
				});
				player.addEffect({
					effectId: "minecraft:jump_boost",
					duration: 10,
					amplifier: 2
				});
				player.addEffect({
					effectId: "minecraft:slow_falling",
					duration: 10,
					amplifier: 3
				});
				player.addEffect({
					effectId: "minecraft:night_vision",
					duration: 20,
					amplifier: 0
				});
			} else {
				// Base effects anywhere
				player.addEffect({
					effectId: "minecraft:speed",
					duration: 10,
					amplifier: 0
				});
				player.addEffect({
					effectId: "minecraft:jump_boost",
					duration: 10,
					amplifier: 0
				});
			}
		}
	} catch (e) {
		player.sendMessage(`[ARW] Necklace error: ${e}`);
	}
}

function handleNecklaceAttackEffects(attacker, target) {
	try {
		// Necklace of Jungle - Venom effect on attack
		if (isHoldingNecklaceOfJungle(attacker)) {
			const inJungle = isInJungleBiome(attacker);
			const venomDuration = inJungle ? 100 : 50;
			
			target.addEffect({
				effectId: "minecraft:poison",
				duration: venomDuration,
				amplifier: 0
			});
			
			if (inJungle) {
				attacker.sendMessage("[ARW] Jungle venom courses through your foe!");
			}
		}
	} catch (e) {
		attacker.sendMessage(`[ARW] Necklace attack error: ${e}`);
	}
}

function giveWither(player) {
	try {
		player.addEffect(WITHER_EFFECT);
		player.sendMessage("[ARW] You've been cursed with Wither!");
	} catch (e) {
		player.sendMessage(`[ARW] Wither curse failed: ${e}`);
	}
}

function removeWither(player) {
	try {
		player.removeEffect("minecraft:wither");
	} catch (e) {
		player.sendMessage(`[ARW] Wither removal failed: ${e}`);
	}
}

function playShogunTheme(player) {
	try {
		player.playSound("arw.shogun_theme");
		player.sendMessage("[ARW] Shogun spirit flows through you!");
	} catch (e) {
		player.sendMessage(`[ARW] Theme error: ${e}`);
	}
}

function processScheduledLightning() {
	for (let i = scheduledLightningStrikes.length - 1; i >= 0; i--) {
		const strike = scheduledLightningStrikes[i];
		strike.ticksLeft--;

		if (strike.ticksLeft <= 0) {
			try {
				const dimension = world.getDimension(strike.dimensionId);
				const target = dimension.getEntities().find(e => e.id === strike.targetId);

				if (target?.isValid()) {
					dimension.spawnEntity("minecraft:lightning_bolt", target.location);
					strike.attacker.sendMessage("[ARW] Lightning struck your foe!");

					if (Math.random() < 0.10) {
						target.applyDamage(1000, { damageSource: "magic" });
						strike.attacker.sendMessage("[ARW] Instakill with lightning!");
					}
				}
			} catch (e) {
				strike.attacker.sendMessage(`[ARW] Lightning failed: ${e}`);
			}
			scheduledLightningStrikes.splice(i, 1);
		}
	}
}

function processMagmaWalkerBlocks() {
	const currentTime = Date.now();
	
	for (const [blockKey, data] of magmaWalkerBlocks) {
		if (currentTime >= data.expireTime) {
			try {
				const dimension = world.getDimension(data.dimensionId);
				const block = dimension.getBlock(data.location);
				if (block?.typeId === "minecraft:basalt") {
					block.setType("minecraft:lava");
				}
			} catch (e) {
				// Silent error handling
			} finally {
				magmaWalkerBlocks.delete(blockKey);
			}
		}
	}
}

function handleMagmaWalker(player) {
	if (!isHoldingNecklaceOfMagma(player)) return;
	
	try {
		const dimension = world.getDimension(player.dimension.id);
		const loc = player.location;
		const y = Math.floor(loc.y) - 1;
		
		// Convert lava to basalt in 5x5 area under player
		for (let x = Math.floor(loc.x) - 2; x <= Math.floor(loc.x) + 2; x++) {
			for (let z = Math.floor(loc.z) - 2; z <= Math.floor(loc.z) + 2; z++) {
				const blockLoc = { x, y, z };
				const block = dimension.getBlock(blockLoc);
				
				if (block?.typeId === "minecraft:lava") {
					block.setType("minecraft:basalt");
					
					const blockKey = `${x},${y},${z}`;
					magmaWalkerBlocks.set(blockKey, {
						location: blockLoc,
						dimensionId: player.dimension.id,
						expireTime: Date.now() + 10000 // 10 seconds
					});
				}
			}
		}
	} catch (e) {
		// Silent error handling
	}
}

// Main game tick handler
world.events.tick.subscribe(() => {
	processScheduledLightning();
	processMagmaWalkerBlocks();

	for (const player of world.getPlayers()) {
		try {
			let state = playersWithTimer.get(player.id);
			if (!state) {
				state = {
					timer: 0,
					maxTime: getRandomTimer(),
					cursed: false,
					holding: false
				};
				playersWithTimer.set(player.id, state);
			}

			const offhandType = getOffHandTypeId(player);
			const offhandHasItem = offhandType && offhandType !== "minecraft:air";

			// SHOGUN KATANA THEME MUSIC
			if (isHoldingShogunKatana(player)) {
				if (!shogunKatanaPlayers.has(player.id)) {
					playShogunTheme(player);
					shogunKatanaPlayers.add(player.id);
				}
			} else if (shogunKatanaPlayers.has(player.id)) {
				shogunKatanaPlayers.delete(player.id);
			}

			// NECKLACE EFFECTS
			applyNecklaceEffects(player);
			handleMagmaWalker(player);

			// POLEAXE EFFECTS
			if (isHoldingPoleaxe(player)) {
				player.addEffect({
					effectId: "minecraft:slowness",
					duration: 10,
					amplifier: offhandHasItem ? 2 : 0
				});

				if (offhandHasItem) {
					player.addEffect({
						effectId: "minecraft:weakness",
						duration: 10,
						amplifier: 1
					});
					player.sendMessage("[ARW] Poleaxe offhand penalty!");
				}
			}

			// KATANA EFFECTS
			if (isHoldingKatana(player)) {
				const katanaId = getMainHandTypeId(player);
				const effectsMap = {
					"arw:diamond_katana": [
						{ effectId: "minecraft:hunger", duration: 10, amplifier: 1 },
						{ effectId: "minecraft:speed", duration: 10, amplifier: 1 },
						{ effectId: "minecraft:jump_boost", duration: 10, amplifier: 1 }
					],
					"arw:steel_katana": [
						{ effectId: "minecraft:speed", duration: 10, amplifier: 2 },
						{ effectId: "minecraft:jump_boost", duration: 10, amplifier: 1 }
					],
					"arw:iron_katana": [
						{ effectId: "minecraft:hunger", duration: 10, amplifier: 0 },
						{ effectId: "minecraft:speed", duration: 10, amplifier: 0 }
					]
				};

				effectsMap[katanaId]?.forEach(effect => player.addEffect(effect));

				if (offhandHasItem) {
					player.addEffect({
						effectId: "minecraft:weakness",
						duration: 10,
						amplifier: 2 
					});
					player.sendMessage("[ARW] Katana offhand penalty!");
				}
			}

			// SACRIFICIAL DAGGER LOGIC
			if (isHoldingSacrificialDagger(player)) {
				if (!state.holding) {
					state.timer = 0;
					state.maxTime = getRandomTimer();
					state.holding = true;
					player.sendMessage("[ARW] Dagger thirsts for blood...");
				}

				if (++state.timer >= state.maxTime && !state.cursed) {
					giveWither(player);
					state.cursed = true;
				}
			} else if (state.holding) {
				if (state.cursed) removeWither(player);
				state.timer = 0;
				state.cursed = false;
				state.holding = false;
			}
		} catch (e) {
			player.sendMessage(`[ARW] Error: ${e}`);
		}
	}
});

// Entity hurt event handler
world.afterEvents.entityHurt.subscribe(event => {
	const attacker = event.damageSource.sourceEntity;
	const target = event.hurtEntity;

	if (!attacker?.isPlayer || !target) return;

	let state = playersWithTimer.get(attacker.id);
	if (!state) {
		state = {
			timer: 0,
			maxTime: getRandomTimer(),
			cursed: false,
			holding: false
		};
		playersWithTimer.set(attacker.id, state);
	}

	// AMETHYST SPEAR ATTACK
	if (isHoldingAmethystSpear(attacker)) {
		// Apply guaranteed Weakness II
		target.addEffect({
			effectId: "minecraft:weakness",
			duration: AMETHYST_SPEAR_EFFECTS.weaknessDuration,
			amplifier: AMETHYST_SPEAR_EFFECTS.weaknessAmplifier
		});

		// Health reduction effect (40% chance)
		if (Math.random() < AMETHYST_SPEAR_EFFECTS.healthReductionChance) {
			try {
				const health = target.getComponent('health');
				if (health) {
					const currentHealth = health.currentValue;
					const reduction = Math.min(
						AMETHYST_SPEAR_EFFECTS.healthReductionAmount,
						currentHealth - 1
					);
					health.setCurrentValue(currentHealth - reduction);
					attacker.sendMessage(`[ARW] Spear drained ${reduction/2} hearts!`);
				} else {
					// Fallback: Instant Damage III
					target.addEffect({
						effectId: "minecraft:instant_damage",
						duration: 1,
						amplifier: 2
					});
					attacker.sendMessage("[ARW] Spear dealt massive damage!");
				}
			} catch (e) {
				target.applyDamage(AMETHYST_SPEAR_EFFECTS.healthReductionAmount);
			}
		}
	}

	// SACRIFICIAL DAGGER ATTACK
	if (isHoldingSacrificialDagger(attacker)) {
		if (state.cursed) {
			removeWither(attacker);
			attacker.sendMessage("[ARW] Curse broken!");
			state.cursed = false;
		}

		state.timer = 0;
		state.maxTime = getRandomTimer();

		attacker.addEffect({
			effectId: "minecraft:instant_health",
			duration: 1,
			amplifier: 0
		});

		target.damage(4);
		attacker.sendMessage("[ARW] Life stolen from foe!");
	}

	// ROYAL KRIS ATTACK
	if (isHoldingItem(attacker, "arw:royal_kris")) {
		attacker.addEffect({
			effectId: "minecraft:speed",
			duration: 100,
			amplifier: 0
		});
		attacker.sendMessage("[ARW] Kris boosts agility!");

		if (Math.random() < 0.6) {
			target.addEffect({
				effectId: "minecraft:weakness",
				duration: 80,
				amplifier: 1
			});
			attacker.sendMessage("[ARW] Weakness II inflicted!");
		}

		target.addEffect({
			effectId: "minecraft:poison",
			duration: 160,
			amplifier: 0
		});

		const offhandEmpty = !getOffHandTypeId(attacker) || getOffHandTypeId(attacker) === "minecraft:air";
		
		if (Math.random() < (offhandEmpty ? 0.7 : 0.3)) {
			attacker.addEffect({
				effectId: "minecraft:strength",
				duration: 100,
				amplifier: 1
			});
			attacker.sendMessage("[ARW] Strength II empowered!");
		}
	}

	// POLEAXE KNOCKBACK
	if (isHoldingPoleaxe(attacker)) {
		const direction = attacker.getViewDirection();
		target.applyKnockback(direction.x, direction.z, 1.5, 0.5);
		attacker.sendMessage("[ARW] Poleaxe smashed enemy!");
	}

	// SHOGUN KATANA ATTACK
	if (isHoldingShogunKatana(attacker)) {
		const offhandEmpty = !getOffHandTypeId(attacker) || getOffHandTypeId(attacker) === "minecraft:air";

		if (offhandEmpty) {
			if (Math.random() < 0.8) {
				target.addEffect({
					effectId: "minecraft:slowness",
					duration: 100,
					amplifier: 2
				});
				target.addEffect({
					effectId: "minecraft:weakness",
					duration: 100,
					amplifier: 3
				});
				attacker.sendMessage("[ARW] Inflicted Slowness III & Weakness IV!");
			}

			if (Math.random() < 0.15) {
				scheduledLightningStrikes.push({
					targetId: target.id,
					attacker,
					dimensionId: target.dimension.id,
					ticksLeft: 100
				});
				attacker.sendMessage("[ARW] Lightning in 5 seconds!");
			}
		}

		const direction = attacker.getViewDirection();
		target.applyKnockback(direction.x, direction.z, 1.125, 0.5);
		attacker.sendMessage("[ARW] Controlled knockback!");
	}

	// NECKLACE ATTACK EFFECTS
	handleNecklaceAttackEffects(attacker, target);
});