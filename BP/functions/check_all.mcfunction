scoreboard players set @a mainhand 0
execute as @a[hasitem={item=arw:steel_katana,location=slot.weapon.mainhand}] run scoreboard players set @s mainhand 1
execute as @a[hasitem={item=arw:iron_katana,location=slot.weapon.mainhand}] run scoreboard players set @s mainhand 2
execute as @a[hasitem={item=arw:diamond_katana,location=slot.weapon.mainhand}] run scoreboard players set @s mainhand 3
execute as @a[hasitem={item=arw:shogun_katana,location=slot.weapon.mainhand}] run scoreboard players set @s mainhand 4
execute as @a[hasitem={item=arw:steel_poleaxe,location=slot.weapon.mainhand}] run scoreboard players set @s mainhand 5
execute as @a[hasitem={item=arw:wind_poleaxe,location=slot.weapon.mainhand}] run scoreboard players set @s mainhand 6
execute as @a[hasitem={item=arw:netherite_poleaxe,location=slot.weapon.mainhand}] run scoreboard players set @s mainhand 7
execute as @a[hasitem={item=arw:imperial_rapier,location=slot.weapon.mainhand}] run scoreboard players set @s mainhand 8
execute as @a[hasitem={item=arw:amethyst_spear,location=slot.weapon.mainhand}] run scoreboard players set @s mainhand 9
execute as @a at @s if entity @s[hasitem={item=arw:sacrificial_daga,location=slot.weapon.mainhand}] run scoreboard players set @s mainhand 10
execute as @a[hasitem={item=arw:dao,location=slot.weapon.mainhand}] run scoreboard players set @s mainhand 11
execute as @a[hasitem={item=arw:qiang,location=slot.weapon.mainhand}] run scoreboard players set @s mainhand 12
execute as @a[hasitem={item=arw:royal_kris,location=slot.weapon.mainhand}] run scoreboard players set @s mainhand 13
execute as @a[hasitem={item=arw:steel_claymore,location=slot.weapon.mainhand}] run scoreboard players set @s mainhand 14
execute as @a[hasitem={item=arw:iron_claymore,location=slot.weapon.mainhand}] run scoreboard players set @s mainhand 15
execute as @a[hasitem={item=arw:netherite_claymore,location=slot.weapon.mainhand}] run scoreboard players set @s mainhand 16
scoreboard players set @a offhand 0
execute as @a[hasitem={item=arw:necklace_of_breeze,location=slot.weapon.offhand}] run scoreboard players set @s offhand 1
execute as @a[hasitem={item=arw:necklace_of_immortality,location=slot.weapon.offhand}] run scoreboard players set @s offhand 2
execute as @a[hasitem={item=arw:necklace_of_jungle,location=slot.weapon.offhand}] run scoreboard players set @s offhand 3
execute as @a[hasitem={item=arw:necklace_of_magma,location=slot.weapon.offhand}] run scoreboard players set @s offhand 4
execute as @a[hasitem={item=minecraft:shield,location=slot.weapon.offhand}] run scoreboard players set @s offhand 5
execute as @a[hasitem={item=minecraft:arrow,location=slot.weapon.offhand}] run scoreboard players set @s offhand 6
execute as @a[hasitem={item=minecraft:firework_rocket,location=slot.weapon.offhand}] run scoreboard players set @s offhand 7
execute as @a[hasitem={item=minecraft:totem_of_undying,location=slot.weapon.offhand}] run scoreboard players set @s offhand 8
execute as @a[hasitem={item=minecraft:filled_map,location=slot.weapon.offhand}] run scoreboard players set @s offhand 9
execute as @a[hasitem={item=minecraft:nautilus_shell,location=slot.weapon.offhand}] run scoreboard players set @s offhand 10
execute as @a[hasitem={item=arw:banner_hero,location=slot.weapon.offhand}] run scoreboard players set @s offhand 11
scoreboard players set @a head 0
execute as @a[hasitem={item=arw:ender_pearl_earrings,location=slot.armor.head}] run scoreboard players set @s head 1
execute as @a[hasitem={item=arw:sacred_knight_helmet,location=slot.armor.head}] run scoreboard players set @s head 2
scoreboard players set @a chestplate 0
execute as @a[hasitem={item=arw:sacred_knight_chestplate,location=slot.armor.chest}] run scoreboard players set @s chestplate 1
scoreboard players set @a leggings 0
execute as @a[hasitem={item=arw:sacred_knight_leggings,location=slot.armor.legs}] run scoreboard players set @s leggings 1
scoreboard players set @a boots 0
execute as @a[hasitem={item=arw:sacred_knight_boots,location=slot.armor.feet}] run scoreboard players set @s boots 1
function give_power