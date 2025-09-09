# Reset scoreboard
scoreboard players set @a poleaxe 0

# Detect steel poleaxe in mainhand
execute as @a[hasitem={item=arw:steel_poleaxe,location=slot.weapon.mainhand}] run scoreboard players set @s poleaxe 1

# Detect wind poleaxe in mainhand
execute as @a[hasitem={item=arw:wind_poleaxe,location=slot.weapon.mainhand}] run scoreboard players set @s poleaxe 2

# Detect netherite poleaxe in mainhand
execute as @a[hasitem={item=arw:netherite_poleaxe,location=slot.weapon.mainhand}] run scoreboard players set @s poleaxe 3

# Call power function
function arw/give_poleaxe_power
