# Andy's Real Weapons Add-on

## Overview
Andy's Real Weapons is a Minecraft Bedrock Edition add-on that adds a wide variety of new weapons, dagas, katanas, kris, poleaxes, rapiers, spears, and magical necklaces. Each item features custom effects, mechanics, and crafting recipes, designed for a unique and challenging combat experience.

---

## Features
- **New Weapons:** Custom swords, dagas, katanas, kris, poleaxes, rapiers, spears, and more.
- **Necklaces:** Equip in offhand for passive and triggered effects, including biome-based bonuses and special abilities.
- **Custom Mechanics:** Durability, cooldowns, offhand effects, curse systems, Magma Walker, and more.
- **Progression:** Crafting, upgrading, and infusing items for advanced effects.
- **Unique Effects:** Status inflictions, synergy between items, and special attack logic.

---

## Item Documentation
### Weapons
- **Swords:** All vanilla swords plus custom swords (steel, imperial, etc.)
- **Dagas:** Jade Daga, Flint Daga, Iron Daga, Gold Daga, Netherite Daga, Sacrificial Daga, Jade Daga Dull, Jade Daga Polished
- **Katanas:** Diamond Katana, Steel Katana, Iron Katana, Shogun Katana
- **Poleaxes:** Steel Poleaxe, Netherite Poleaxe
- **Rapiers:** Steel Rapier, Iron Rapier, Imperial Rapier
- **Spears:** Amethyst Spear, Flint Spear, Steel Spear
- **Kris:** Gold Kris, Iron Kris, Netherite Kris, Royal Kris

#### Example: Jade Daga
- **Main Hand:** Sword damage, enchantable.
- **Offhand:** 10% chance to inflict Weakness 255 and Slowness 255 when attacking with a sword/daga (see allowed list), loses extra durability on trigger.
- **Durability:** 53
- **Enchantable:** Yes (slot: sword, value: 19)
- **Crafting:** See below.

### Kris
- **Gold Kris, Iron Kris, Netherite Kris, Royal Kris:** Each kris has unique effects and progression. Royal Kris has special attack effects and can be upgraded from other kris.

### Necklaces
- **Jungle Necklace:** Speed, jump boost, slow falling, and night vision in jungle biomes. Venom effect on attack.
- **Magma Necklace:** Fire resistance, resistance, regeneration when burning, Magma Walker (turns lava to basalt temporarily).
- **Immortality Necklace:** Health boost, instant health and resistance when low HP.
- **Equip:** Offhand slot only.

---

## Mechanics
### Offhand Effects
- Weapons and necklaces can be equipped in the offhand for passive or triggered effects.
- **Jade Daga:** Only triggers effect if main hand is a vanilla sword or custom daga (see allowed list).
- **Necklaces:** Passive effects based on biome, status, or attack.

### Durability & Cooldowns
- All weapons have custom durability values.
- Some effects (e.g., Jade Daga offhand) consume extra durability.
- Cooldowns are set per item (e.g., Jade Daga: 6 ticks attack cooldown).

### Curse System
- **Sacrificial Daga:** Builds up a curse over time, inflicts Wither when maxed, can be broken by attacking.

### Magma Walker
- **Magma Necklace:** Temporarily turns lava blocks to basalt when walking over them. Reverts after 10 seconds.

---

## Crafting Recipes
### Example Recipes
#### Jade Daga Dull
```
Crafting Table (Shaped):
Pattern:
   
 j 
j  
Key:
- j: Jade Gem (arw:jade_gem)
Result: Jade Daga Dull (arw:jade_daga_dull)
```
#### Jade Daga Polished
```
Polishing Table (Shapeless):
Ingredients:
- Jade Daga Dull (arw:jade_daga_dull)
- Iron Daga (arw:iron_daga)
Result: Jade Daga (arw:jade_daga)
```
#### Iron Daga
```
Crafting Table (Shaped):
Pattern:
I
W
Key:
- I: Iron Ingot
- W: Stick
Result: Iron Daga (arw:iron_daga)
```
#### Gold Daga
```
Crafting Table (Shaped):
Pattern:
G
S
Key:
- G: Gold Ingot
- S: Stick
Result: Gold Daga (arw:gold_daga)
```
#### Netherite Daga
```
Crafting Table (Shaped):
Pattern:
N
S
Key:
- N: Netherite Ingot
- S: Iron Stick (arw:iron_stick)
Result: Netherite Daga (arw:netherite_daga)
```
#### Flint Daga
```
Crafting Table (Shaped):
Pattern:
F
S
W
Key:
- F: Flint
- S: String
- W: Stick
Result: Flint Daga (arw:flint_daga)
```
#### Steel Katana Ascension (Shogun Katana)
```
Crafting Table (Shaped):
Pattern:
CGC
GSG
CGC
Key:
- C: Cursed Netherite Ingot
- G: Enchanted Golden Apple
- S: Steel Katana
Result: Shogun Katana (arw:shogun_katana)
```
#### Diamond Katana
```
Crafting Table (Shaped):
Pattern:
  D
 DD
S  
Key:
- D: Diamond
- S: Stick
Result: Diamond Katana (arw:diamond_katana)
```
#### Iron Katana
```
Crafting Table (Shaped):
Pattern:
  I
 II
S  
Key:
- I: Iron Ingot
- S: Stick
Result: Iron Katana (arw:iron_katana)
```
#### Gold Kris
```
Crafting Table (Shaped):
Pattern:
 GG
GG 
S  
Key:
- G: Gold Ingot
- S: Stick
Result: Gold Kris (arw:gold_kris)
```
#### Iron Kris
```
Crafting Table (Shaped):
Pattern:
 II
II 
S  
Key:
- I: Iron Ingot
- S: Stick
Result: Iron Kris (arw:iron_kris)
```
#### Netherite Kris
```
Crafting Table (Shaped):
Pattern:
 NN
NN 
S  
Key:
- N: Netherite Ingot
- S: Stick
Result: Netherite Kris (arw:netherite_kris)
```
#### Necklace of Jungle
```
Infusion Table (Shapeless):
Ingredients:
- Elixir of the Jungle (arw:elixir_of_the_jungle)
- Empty Necklace (arw:empty_necklace)
Result: Necklace of Jungle (arw:necklace_of_jungle)
```
#### Empty Necklace
```
Crafting Table (Shaped):
Pattern:
 GG
G G
GGB
Key:
- G: Gold Nugget
- B: Glass Bottle
Result: Empty Necklace (arw:empty_necklace)
```
#### Amethyst Spear
```
Crafting Table (Shaped):
Pattern:
  L
 T 
T  
Key:
- L: Amethyst Shard
- T: Stick
Result: Amethyst Spear (arw:amethyst_spear)
```
*For full recipes, see the `/BP/recipes/` folder in the pack.*

---

## Progression & Upgrades
- Upgrade weapons using special ingots, gems, or infusions.
- Polish dagas for improved stats.
- Infuse necklaces for biome-specific powers.
- Kris can be upgraded to Royal Kris via special recipe.

---

## Compatibility
- Works with Minecraft Bedrock Edition 1.21.90+
- Designed for survival and adventure gameplay.

---

## Installation
1. Download the `.mcaddon` file from the `builds/` folder.
2. Import into Minecraft via double-click or move to `com.mojang`/`behavior_packs` and `resource_packs`.
3. Enable the pack in your world settings.

---

## Credits
- Add-on by Andy64lolxd
- Special thanks to contributors and testers

---

## Support & Feedback
For bug reports, suggestions, or help, contact via GitHub or Minecraft forums.

---

Enjoy Andy's Real Weapons and master the art of combat!
