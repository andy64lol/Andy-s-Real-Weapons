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

// State trackers
const playersWithTimer = new Map();
const scheduledLightningStrikes = [];
const shogunKatanaPlayers = new Set();
const amethystSpearCooldowns = new Map();

// Helper Functions
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

function giveWither(player) {
	try {
		player.addEffect(WITHER_EFFECT);
		player.sendMessage("[ARW] You have been cursed with Wither for not shedding blood.");
	} catch (e) {
		player.sendMessage(`[ARW] Error giving Wither: ${e}`);
	}
}

function removeWither(player) {
	try {
		player.removeEffect("minecraft:wither");
	} catch (e) {
		player.sendMessage(`[ARW] Error removing Wither: ${e}`);
	}
}

function playShogunTheme(player) {
	try {
		player.playSound("arw.shogun_theme");
		player.sendMessage("[ARW] You feel the spirit of the Shogun flowing through you!");
	} catch (e) {
		player.sendMessage(`[ARW] Failed to play theme: ${e}`);
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

				if (target && target.isValid()) {
					dimension.spawnEntity("minecraft:lightning_bolt", target.location);
					strike.attacker.sendMessage("[ARW] Lightning struck your foe!");

					if (Math.random() < 0.10) {
						target.applyDamage(1000, { damageSource: "magic" });
						strike.attacker.sendMessage("[ARW] You instantly killed your foe with Shogun Katana's lightning!");
					}
				}
			} catch (e) {
				strike.attacker.sendMessage(`[ARW] Lightning strike failed: ${e}`);
			}
			scheduledLightningStrikes.splice(i, 1);
		}
	}
}

function processAmethystSpearCooldowns() {
	for (const [playerId, cooldown] of amethystSpearCooldowns) {
		if (cooldown <= 0) {
			amethystSpearCooldowns.delete(playerId);
		} else {
			amethystSpearCooldowns.set(playerId, cooldown - 1);
		}
	}
}

// Main game tick handler
world.events.tick.subscribe(() => {
	processScheduledLightning();
	processAmethystSpearCooldowns();

	for (const player of world.getPlayers()) {
		try {
			const state = playersWithTimer.get(player.id) || {
				timer: 0,
				maxTime: getRandomTimer(),
				cursed: false,
				holding: false
			};

			const offhandType = getOffHandTypeId(player);
			const offhandHasItem = offhandType && offhandType !== "minecraft:air";

			// SHOGUN KATANA THEME MUSIC
			const holdingShogun = isHoldingShogunKatana(player);
			if (holdingShogun && !shogunKatanaPlayers.has(player.id)) {
				playShogunTheme(player);
				shogunKatanaPlayers.add(player.id);
			} else if (!holdingShogun && shogunKatanaPlayers.has(player.id)) {
				shogunKatanaPlayers.delete(player.id);
			}

			// POLEAXE EFFECTS
			if (isHoldingPoleaxe(player)) {
				const slownessAmplifier = offhandHasItem ? 2 : 0;
				player.addEffect({
					effectId: "minecraft:slowness",
					duration: 10,
					amplifier: slownessAmplifier
				});

				if (offhandHasItem) {
					player.addEffect({
						effectId: "minecraft:weakness",
						duration: 10,
						amplifier: 1
					});
					player.sendMessage("[ARW] Holding poleaxe with offhand item causes Slowness III and Weakness II.");
				}
			}

			// KATANA EFFECTS
			if (isHoldingKatana(player)) {
				const katanaId = getMainHandTypeId(player);
				const katanaEffects = {
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

				katanaEffects[katanaId]?.forEach(effect => {
					player.addEffect(effect);
				});

				if (offhandHasItem) {
					player.addEffect({
						effectId: "minecraft:weakness",
						duration: 10,
						amplifier: 2
					});
					player.sendMessage("[ARW] Carrying offhand item applies Weakness III while wielding Katana.");
				}
			}

			// SACRIFICIAL DAGGER LOGIC
			if (isHoldingSacrificialDagger(player)) {
				if (!state.holding) {
					state.timer = 0;
					state.maxTime = getRandomTimer();
					state.holding = true;
					player.sendMessage("[ARW] The Sacrificial Dagger thirsts for blood...");
				}

				state.timer++;

				if (!state.cursed && state.timer >= state.maxTime) {
					giveWither(player);
					state.cursed = true;
				}
			} else {
				if (state.cursed) removeWither(player);
				state.timer = 0;
				state.cursed = false;
				state.holding = false;
			}

			playersWithTimer.set(player.id, state);
		} catch (e) {
			player.sendMessage(`[ARW] Error: ${e}`);
		}
	}
});

// Entity hurt event handler
world.afterEvents.entityHurt.subscribe(event => {
	const attacker = event.damageSource.sourceEntity;
	const target = event.hurtEntity;

	if (!attacker || !target || !attacker.isPlayer) return;

	const state = playersWithTimer.get(attacker.id) || {
		timer: 0,
		maxTime: getRandomTimer(),
		cursed: false,
		holding: false
	};

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
					attacker.sendMessage(`[ARW] Your Amethyst Spear drained ${reduction / 2} hearts from your foe!`);
				} else {
					// Fallback: Instant Damage III
					target.addEffect({
						effectId: "minecraft:instant_damage",
						duration: 1,
						amplifier: 2
					});
					attacker.sendMessage("[ARW] Your Amethyst Spear deals massive damage!");
				}
			} catch (e) {
				// Ultimate fallback: Standard damage
				target.applyDamage(AMETHYST_SPEAR_EFFECTS.healthReductionAmount, { damageSource: "magic" });
			}
		}

		// Cooldown to prevent effect spamming
		amethystSpearCooldowns.set(attacker.id, 20); // 1 second cooldown
	}

	// SACRIFICIAL DAGGER ATTACK
	if (isHoldingSacrificialDagger(attacker)) {
		if (state.cursed) {
			removeWither(attacker);
			attacker.sendMessage("[ARW] You broke the curse by shedding blood.");
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
		attacker.sendMessage("[ARW] The Sacrificial Dagger steals life from your foe!");
		playersWithTimer.set(attacker.id, state);
	}

	// ROYAL KRIS ATTACK
	if (isHoldingItem(attacker, "arw:royal_kris")) {
		attacker.addEffect({
			effectId: "minecraft:speed",
			duration: 100,
			amplifier: 0
		});
		attacker.sendMessage("[ARW] Royal Kris boosts your agility!");

		if (Math.random() < 0.6) {
			target.addEffect({
				effectId: "minecraft:weakness",
				duration: 80,
				amplifier: 1
			});
			attacker.sendMessage("[ARW] You inflicted Weakness II on your target!");
		}

		target.addEffect({
			effectId: "minecraft:poison",
			duration: 160,
			amplifier: 0
		});

		const offhandType = getOffHandTypeId(attacker);
		const offhandIsEmpty = !offhandType || offhandType === "minecraft:air";
		const strengthChance = offhandIsEmpty ? 0.7 : 0.3;

		if (Math.random() < strengthChance) {
			attacker.addEffect({
				effectId: "minecraft:strength",
				duration: 100,
				amplifier: 1
			});
			attacker.sendMessage("[ARW] Royal Kris empowered you with Strength II!");
		}
	}

	// POLEAXE KNOCKBACK
	if (isHoldingPoleaxe(attacker)) {
		const direction = attacker.getViewDirection();
		target.applyKnockback(direction.x, direction.z, 1.5, 0.5);
		attacker.sendMessage("[ARW] Your poleaxe smashes the enemy back!");
	}

	// SHOGUN KATANA ATTACK
	if (isHoldingShogunKatana(attacker)) {
		const offhandType = getOffHandTypeId(attacker);
		const offhandIsEmpty = !offhandType || offhandType === "minecraft:air";

		if (offhandIsEmpty && Math.random() < 0.8) {
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
			attacker.sendMessage("[ARW] You inflicted Slowness III and Weakness IV!");
		}

		if (offhandIsEmpty && Math.random() < 0.15) {
			scheduledLightningStrikes.push({
				targetId: target.id,
				attacker,
				dimensionId: target.dimension.id,
				ticksLeft: 100
			});
			attacker.sendMessage("[ARW] Lightning will strike your foe in 5 seconds!");
		}

		const direction = attacker.getViewDirection();
		target.applyKnockback(direction.x, direction.z, 1.125, 0.5);
		attacker.sendMessage("[ARW] Your Shogun Katana delivers controlled knockback!");
	}
});