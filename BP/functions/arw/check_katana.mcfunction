scoreboard players set @a holding 0

# Detect steel katana
execute as @a[hasitem={item=arw:steel_katana,location=slot.weapon.mainhand}] run scoreboard players set @s holding 1

# Detect iron katana
execute as @a[hasitem={item=arw:iron_katana,location=slot.weapon.mainhand}] run scoreboard players set @s holding 2

# Detect diamond katana
execute as @a[hasitem={item=arw:diamond_katana,location=slot.weapon.mainhand}] run scoreboard players set @s holding 3

# Detect shogun katana
execute as @a[hasitem={item=arw:shogun_katana,location=slot.weapon.mainhand}] run scoreboard players set @s holding 4

# Run power-giving function
function arw/give_katana_power
