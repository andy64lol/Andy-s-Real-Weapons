# Katana effects
effect @a[scores={mainhand=1}] speed 2 0 true
effect @a[scores={mainhand=1}] strength 1 0 true
effect @a[scores={mainhand=2}] speed 2 1 true
effect @a[scores={mainhand=2}] strength 1 1 true
effect @a[scores={mainhand=3}] speed 2 2 true
effect @a[scores={mainhand=3}] strength 1 2 true
effect @a[scores={mainhand=3}] regeneration 2 0 true
effect @a[scores={mainhand=4}] speed 2 3 true
effect @a[scores={mainhand=4}] strength 1 3 true
effect @a[scores={mainhand=4}] absorption 2 0 true
effect @a[scores={mainhand=4}] regeneration 4 1 true

# Poleaxe effects
effect @a[scores={mainhand=5}] strength 2 1 true
effect @a[scores={mainhand=5}] slowness 2 0 true
effect @a[scores={mainhand=6}] strength 3 0 true
effect @a[scores={mainhand=6}] speed 12 1 true
effect @a[scores={mainhand=6}] jump_boost 8 0 true
effect @a[scores={mainhand=7}] strength 2 2 true
effect @a[scores={mainhand=7}] resistance 2 0 true
effect @a[scores={mainhand=7}] slowness 2 2 true

# Rapier effects
effect @a[scores={mainhand=8}] health_boost 2 3 true
effect @a[scores={mainhand=8}] regeneration 2 1 true
effect @a[scores={mainhand=8}] saturation 2 0 true

# Amethyst spear effects
effect @a[scores={mainhand=9}] night_vision 2 0 true
effect @a[scores={mainhand=9}] darkness 2 0 true
effect @a[scores={mainhand=9}] speed 2 3 true

# Sacrificial daga effects
effect @a[scores={mainhand=10}] strength 2 2 true
effect @a[scores={mainhand=10}] health_boost 2 2 true
effect @a[scores={mainhand=10}] speed 2 1 true
effect @a[scores={mainhand=10}] jump_boost 2 1 true
effect @a[scores={mainhand=10}] absorption 2 1 true
effect @a[scores={mainhand=10}] darkness 2 2 true
effect @a[scores={mainhand=10}] wither 0 2 true
effect @a[scores={mainhand=10}] hunger 2 2 true
effect @a[scores={mainhand=10}] mining_fatigue 10 2 true

# Dao effects
execute as @a[scores={mainhand=11}] at @s run effect @e[type=!player,r=5] weakness 3 1 true

# Qiang effects
execute as @a[scores={mainhand=12}] run effect @e[type=!player,r=5] weakness 3 1 true

# Royal kris effects
effect @a[scores={mainhand=13}] speed 2 1 true
effect @a[scores={mainhand=13}] strength 2 1 true
effect @a[scores={mainhand=13}] resistance 2 0 true
effect @a[scores={mainhand=13}] jump_boost 2 0 true

# Necklace effects
effect @a[scores={offhand=1}] jump_boost 2 0 true
effect @a[scores={offhand=1}] speed 2 0 true
effect @a[scores={offhand=2}] regeneration 2 0 true
effect @a[scores={offhand=2}] resistance 2 0 true
effect @a[scores={offhand=3}] strength 2 0 true
effect @a[scores={offhand=3}] speed 2 0 true
effect @a[scores={offhand=4}] fire_resistance 2 0 true
effect @a[scores={offhand=4}] strength 2 0 true

# Ender pearl earrings

execute as @a[scores={head=1..}] at @s run particle minecraft:dragon_breath_fire ~ ~1 ~ 0.5 0.5 0.5 0 3
execute as @a[scores={head=1..}] at @s run particle minecraft:end_chest ~ ~1 ~ 1 1 1 0 40
effect @a[scores={head=1..}] night_vision 1 0 true
effect @a[scores={head=1..}] jump_boost 9 0 true
effect @a[scores={head=1..}] speed 9 1 true
effect @a[scores={head=1..}] invisibility 1 10 true