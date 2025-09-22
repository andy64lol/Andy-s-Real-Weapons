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
execute as @a[scores={mainhand=12}] at @s run effect @e[type=!player,r=5] weakness 3 1 true
# Royal kris effects
effect @a[scores={mainhand=13}] speed 2 1 true
effect @a[scores={mainhand=13}] strength 2 1 true
effect @a[scores={mainhand=13}] resistance 2 0 true
effect @a[scores={mainhand=13}] jump_boost 2 0 true
# Claymore effects
effect @a[scores={mainhand=14}] slowness 3 1 true
effect @a[scores={mainhand=14,offhand=0}] resistance 4 0 true
effect @a[scores={mainhand=15}] slowness 5 1 true
effect @a[scores={mainhand=15,offhand=0}] resistance 7 1 true
effect @a[scores={mainhand=16}] slowness 7 1 true
effect @a[scores={mainhand=16,offhand=0}] resistance 10
effect @a[scores={mainhand=14..15,offhand=1..}] weakness 3 0 true
effect @a[scores={mainhand=16,offhand=1..}] weakness 6 0 true
# Necklace effects
effect @a[scores={offhand=1}] jump_boost 2 0 true
effect @a[scores={offhand=1}] speed 2 0 true
effect @a[scores={offhand=2}] regeneration 2 0 true
effect @a[scores={offhand=2}] resistance 2 0 true
effect @a[scores={offhand=3}] strength 2 0 true
effect @a[scores={offhand=3}] speed 2 0 true
effect @a[scores={offhand=4}] fire_resistance 2 0 true
effect @a[scores={offhand=4}] strength 2 0 true
# Hero's banner effects
effect @a[scores={offhand=11}] resistance 1 0 true
effect @a[scores={offhand=11}] regeneration 1 0 true
effect @a[scores={offhand=11}] speed 1 0 true
effect @a[scores={offhand=11}] village_hero 1 0 true
# Conduit amulet effects
effect @a[scores={offhand=12}] water_breathing 1 0 true
effect @a[scores={offhand=12}] night_vision 1 0 true
effect @a[scores={offhand=12,mainhand=17}] speed 1 0 true
effect @a[scores={offhand=12,mainhand=17}] haste 1 0 true
effect @a[scores={offhand=12,mainhand=17}] conduit_power 1 0 true
execute as @a[scores={offhand=12}] at @s run particle minecraft:conduit_attack_emitter ~ ~1 ~
execute as @a[scores={offhand=12,mainhand=17}] at @s run particle minecraft:conduit_particle ~ ~1 ~
execute as @a[scores={offhand=12,mainhand=17}] at @s run particle minecraft:conduit_absorb_particle ~ ~1 ~
# Ender pearl earrings effects
execute as @a[scores={head=1}] at @s run particle minecraft:end_chest ~ ~1 ~
effect @a[scores={head=1}] night_vision 1 0 true
effect @a[scores={head=1}] invisibility 1 10 true
# Sacred knight armor 
effect @a[scores={head=2}] night_vision 0 0 true
effect @a[scores={chestplate=1}] resistance 6 0 true
effect @a[scores={chestplate=1}] regeneration 2 0 true
effect @a[scores={chestplate=1}] health_boost 2 1 true
effect @a[scores={leggings=1}] speed 2 1 true
effect @a[scores={boots=1}] slow_falling 1 0 true