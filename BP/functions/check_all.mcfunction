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
scoreboard players set @a offhand 0
execute as @a[hasitem={item=arw:necklace_of_breeze,location=slot.weapon.offhand}] run scoreboard players set @s offhand 1
execute as @a[hasitem={item=arw:necklace_of_immortality,location=slot.weapon.offhand}] run scoreboard players set @s offhand 2
execute as @a[hasitem={item=arw:necklace_of_jungle,location=slot.weapon.offhand}] run scoreboard players set @s offhand 3
execute as @a[hasitem={item=arw:necklace_of_magma,location=slot.weapon.offhand}] run scoreboard players set @s offhand 4
scoreboard players set @a head 0
execute as @a[hasitem={item=arw:ender_pearl_earrings,location=slot.armor.head}] run scoreboard players set @s head 1
function give_power
