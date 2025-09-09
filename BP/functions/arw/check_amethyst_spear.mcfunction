# Reset scoreboard
scoreboard players set @a amethyst_spear 0

# Detect Amethyst Spear in mainhand
execute as @a[hasitem={item=arw:amethyst_spear,location=slot.weapon.mainhand}] run scoreboard players set @s amethyst_spear 1

# Call power function
function arw/give_amethyst_spear_power
