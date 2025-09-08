# Reset scoreboard every tick
scoreboard players set @a necklace 0

# Check which necklace is in offhand
execute as @a[hasitem={item=arw:necklace_of_breeze,location=slot.weapon.offhand}] run scoreboard players set @s necklace 1
execute as @a[hasitem={item=arw:necklace_of_immortality,location=slot.weapon.offhand}] run scoreboard players set @s necklace 2
execute as @a[hasitem={item=arw:necklace_of_jungle,location=slot.weapon.offhand}] run scoreboard players set @s necklace 3
execute as @a[hasitem={item=arw:necklace_of_magma,location=slot.weapon.offhand}] run scoreboard players set @s necklace 4

# Call power function
function arw/give_necklace_power
