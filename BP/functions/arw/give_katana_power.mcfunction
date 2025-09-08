# Steel Katana → Strength II
/effect give @a[scores={holding=1}] strength 2 1 true

# Iron Katana → Strength II + Speed I + Hunger I
/effect give @a[scores={holding=2}] strength 2 1 true
/effect give @a[scores={holding=2}] speed 2 0 true
/effect give @a[scores={holding=2}] hunger 2 0 true

# Diamond Katana → Strength III + Speed II + Jump Boost II + Hunger II
/effect give @a[scores={holding=3}] strength 2 2 true
/effect give @a[scores={holding=3}] speed 2 1 true
/effect give @a[scores={holding=3}] jump_boost 2 1 true
/effect give @a[scores={holding=3}] hunger 2 1 true

# Shogun Katana → Strength IV + Speed III + Jump Boost III + Regen I + Play Sounds
/effect give @a[scores={holding=4}] strength 2 3 true
/effect give @a[scores={holding=4}] speed 2 2 true
/effect give @a[scores={holding=4}] jump_boost 2 2 true
/effect give @a[scores={holding=4}] regeneration 2 0 true

# Play sounds for Shogun Katana
playsound arw.shogun_theme @a[scores={holding=4}]
playsound arw.katana_unsheathe @a[scores={holding=4}]
