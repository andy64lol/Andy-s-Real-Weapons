# Run setup.mcfunction only if fake player 'setup_flag' is 0
execute unless score setup_flag setup matches 1 run function setup