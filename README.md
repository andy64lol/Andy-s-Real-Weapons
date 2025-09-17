# Andy's Real Weapons Add-on

## Overview
Andy's Real Weapons is a Minecraft Bedrock Edition add-on that introduces a diverse collection of new weapons, elixirs, necklaces, and accessories. Designed for an immersive and challenging combat experience, this add-on features custom mechanics, crafting recipes, and progression systems. All mechanics are implemented using `.mcfunction` files, eliminating the need for experimental gameplay features.

---

## Features
- **New Weapons:** Extensive variety including swords, dagas, katanas, kris, poleaxes, claymores, rapiers, spears, and more.
- **Elixirs and Necklaces:** Brew elixirs and infuse necklaces to gain biome-specific passive and triggered effects.
- **Accessories:** Unique wearable items such as Ender Pearl Earrings and Ender Pearl Helmet.
- **Custom Mechanics:** Durability, cooldowns, offhand effects, curse systems, Magma Walker, and more, all powered by `.mcfunction` commands.
- **Progression:** Crafting, upgrading, polishing, and infusing items for enhanced abilities.
- **Unique Effects:** Status inflictions, item synergies, and special attack logic.

---

## Item Documentation

### Weapons
- **Swords:** Includes vanilla swords plus custom swords like Dao and Qiang.
- **Dagas:** Flint Daga, Iron Daga, Gold Daga, Netherite Daga, Sacrificial Daga.
- **Katanas:** Diamond Katana, Steel Katana, Iron Katana, Shogun Katana.
- **Poleaxes:** Steel Poleaxe, Netherite Poleaxe, Wind Poleaxe.
- **Claymores:** Iron Claymore, Steel Claymore.
- **Rapiers:** Steel Rapier, Iron Rapier, Imperial Rapier.
- **Spears:** Amethyst Spear, Flint Spear, Steel Spear.
- **Kris:** Gold Kris, Iron Kris, Netherite Kris, Royal Kris.

### Elixirs
- **Elixir of the Breeze:** Used in crafting Necklace of the Breeze.
- **Elixir of Immortality:** Used in crafting Necklace of Immortality.
- **Elixir of the Jungle:** Used in crafting Necklace of the Jungle.
- **Elixir of Magma:** Used in crafting Necklace of the Magmatic.

### Necklaces
- **Necklace of the Breeze:** Grants special effects in breeze biomes or related to wind.
- **Necklace of Immortality:** Provides health boost, instant health, and resistance when low HP.
- **Necklace of the Jungle:** Speed, jump boost, slow falling, night vision in jungle biomes, and venom effect on attack.
- **Necklace of the Magmatic:** Fire resistance, resistance, and regeneration when burning.
- **Equip:** Offhand slot only.

### Additional accessories...
- **Ender Pearl Earrings:** Wearable accessory with unique effects.

---

## Crafting Recipes

### Example Recipes

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

#### Dao
```
Crafting Table (Shaped):
Pattern:
I
I
SR
Key:
- I: Steel Ingot (arw:steel_ingot)
- S: Stick
- R: Red Wool
Result: Dao (arw:dao)
```

#### Qiang
```
Crafting Table (Shaped):
Pattern:
  I
 SR
S  
Key:
- I: Steel Ingot (arw:steel_ingot)
- S: Stick
- R: Red Wool
Result: Qiang (arw:qiang)
```

#### Wind Poleaxe
```
Crafting Table (Shaped):
Pattern:
 SW
 SW
S  
Key:
- W: Wind Charge (minecraft:wind_charge)
- S: Iron Stick (arw:iron_stick)
Result: Wind Poleaxe (arw:wind_poleaxe)
```

*For full recipes, see the `/BP/recipes/` folder in the pack.*

---

## Progression & Upgrades
- Upgrade weapons using special ingots or infusions.
- Infuse necklaces for powers.
- Kris can be upgraded to Royal Kris via special recipe.

---

## Compatibility
- Compatible with Minecraft Bedrock Edition 1.21.100 and above.
- No experimental gameplay features or player.json modifications required.
- Designed for survival and adventure gameplay.

---

## Credits
- Add-on by Andy64lolxd

---

## Support & Feedback
For bug reports, suggestions, or help, contact via GitHub or Minecraft forums.

---

Enjoy Andy's Real Weapons and master the art of combat!
