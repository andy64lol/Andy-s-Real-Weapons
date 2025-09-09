# Reset scoreboard
scoreboard players set @a sacrificial_daga 0

# Detect Daga in mainhand using modern execute
execute as @a at @s if entity @s[hasitem={item=arw:sacrificial_daga,location=slot.weapon.mainhand}] run scoreboard players set @s sacrificial_daga 1

# Apply effects
function give_sacrificial_daga_power
