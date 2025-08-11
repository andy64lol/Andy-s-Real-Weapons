
import { ContainerSlot, EquipmentSlot, BlockStateType, EnchantmentType, ItemLockMode, ItemStack, PaletteColor, Player, world, system, BlockPermutation, ItemTypes, Entity, DimensionTypes, DimensionType, Block, BlockStates } from "@minecraft/server";

export class Utility {
    /**
 * @param {Player} player
 * @param {string} effect
 * @param {seconds} duration
 * @param {boolean} hasParticles
 * @param {number} level
 * @author Gamer99
 * @description Adds effects to the player
 * @example
    if (item.typeId === "minecraft:stick" ) {
         addEffect(player,"speed",20,true,3)
         
     }
 */

    static addEffect(entityType, effect, duration, hasParticles, level) {// func1
        entityType.addEffect(effect, duration * 20, { showParticles: hasParticles, amplifier: level -= 1 })
        // this is the function i created 
    };
    
    /**
     * 
     * @param {Player|Entity} entityType 
     * @param {ItemStack} item 
     * @param {String|Number} Slot 
     * @readonly @returns typeId
     * @author Gamer99
     * @description gets the item ID in the slot specified 
    
     * @example 
     *    if (Getitem(player,"hand") === "minecraft:stick") {
            console.warn("yes");
            
        };
     */
    static Getitem(entityType, Slot) {//func2
        const inv = entityType?.getComponent("inventory")?.container
        const equipment = entityType?.getComponent("equippable")
        if (typeof Slot === "number") {
            const item = inv.getItem(Slot);
            return item?.typeId
        }

        switch (Slot) {
            case "hand":
                return equipment.getEquipment("Mainhand")?.typeId
            case "offhand":
                return equipment.getEquipment("Offhand")?.typeId
            case "head":
                return equipment.getEquipment("Head")?.typeId
            case "chest":
                return equipment.getEquipment("Chest")?.typeId
            case "legs":
                return equipment.getEquipment("Legs")?.typeId
            case "feet":
                return equipment.getEquipment("Feet")?.typeId
        }
    };
    /**
     * 
     * @param {Player} player 
     * @returns Entity ID
     * @author Gamer99
     * @description Gets The ID of the entity the player is looking at 
     * @example
     *  
        if (item.typeId === "minecraft:stick" && getViewEntity(player) === "minecraft:cow") {
            //code 
            
        }
    })
     */
    static getViewEntity(player) {//func3
        for (const entity of player.getEntitiesFromViewDirection().map(entity => entity.entity)) {
            return entity
        }

    };
    /**
  * 
  * @param {Player} player 
  * @param {number} amount 
  * @author Gamer 99
  * @description Reduces Itemstack amount 
  * @example
  *   if (item.typeId === "minecraft:stick" ) {
         ReduceAmount(player,2)
         
     }
  */
    static ReduceAmount(player, amount) {//func4
        const inv = player.getComponent("inventory").container
        const item = inv.getItem(player.selectedSlotIndex)
        if (item.amount > amount) {
            item.amount -= amount
            inv.setItem(player.selectedSlotIndex, item)
        } else {
            inv.setItem(player.selectedSlotIndex, undefined)
        }

    };
    /**
     * 
     * @param {Player} player 
     * @param {number} amount 
     * @author Gamer99
     * @description Increase Itemstack amount 
     * @example
     *   if (item.typeId === "minecraft:stick" ) {
           IncreaseAmoun(player,2)
            
        }
     */
    static IncreaseAmount(player, amount) {//func5
        const inv = player.getComponent("inventory").container
        const item = inv.getItem(player.selectedSlotIndex)
        if (item.amount < 64) {
            item.amount += amount
            inv.setItem(player.selectedSlotIndex, item)
        }

    };
    /**
 * 
 * @param {Player} player 
 * @param {Vector3} location 
 * @param {boolean} checkForBlocks 
 * @param {string} dimensionId 
 * @author Gamer99
 * @description can be used to teleport across dimensions or if the the dimension id is the same as the current dimension or is blank teleport within that dimension
 * @example 
 *  if (item.typeId === "minecraft:stick" ) {
      DimensionTp(player,{x:0,y:500,z:0},false)
        
    }
 */
    static DimensionTp(player, location, checkForBlocks, dimensionId) {//func6
        if (dimensionId === "end") {
            player.teleport(location, { checkForBlocks: checkForBlocks, dimension: world.getDimension(`minecraft:` + `the_` + `${dimensionId}`) })


        } else if (dimensionId !== undefined) {
            player.teleport(location, { checkForBlocks: checkForBlocks, dimension: world.getDimension(`minecraft:` + `${dimensionId}`) })

        };

        if (dimensionId === undefined) {
            player.teleport(location, { checkForBlocks: checkForBlocks })

        }
    };
    /**
     * 
     * @param {Player} player 
     * @returns block ID
     * @description used to get the ID of the block the player is looking at
     * @author Gamer99 
     * 
     */
    static GetblockInView(player) {//func7
        return player.getBlockFromViewDirection().block
    };
    /**
     * 
     * @param {Player} player 
     * @param {string} Newblock
     * @description Used to set the block the player is looking at to a new block
     * @author Gamer99 
     */
    static SetblockInView(player, Newblock) {
        player.getBlockFromViewDirection().block.setType(`${Newblock}`)

    };
    /**
     * 
     * @param {Player} player 
     * @param {ItemStack} item
     * @param {ItemStack.Lore} Lore 
     * @author Gamer99
     * @description SetLore to an Item
     * @example 
     *  world.afterEvents.itemUse.subscribe(({ itemStack: item, source: player }) => {
        if (item.typeId === "minecraft:stick" && player.isSneaking) {
            setLore(player, "minecraft:nether_star", "test")
        }
    });
           // if you what to add more than one piece of lore it is done like this
        world.afterEvents.itemUse.subscribe(({ itemStack: item, source: player }) => {
        if (item.typeId === "minecraft:stick" && player.isSneaking) {
            setLore(player, "minecraft:nether_star", ["lol", "test", "g"])
        }
    });  
     */
    static setLore(player, item, Lore) {
        /**
         * @type {container}
         */
        const container = player.getComponent("inventory").container;
        const equipment = player.getComponent("equippable")
        for (let i = 0; i < container.size; i++) {
            try {
                if (Lore !== undefined && container.getSlot(i).typeId === `${item}` && !container.getSlot(i).getLore().includes(`${Lore}`)) {
                    container.getSlot(i).setLore([`${Lore}`])
                } else if (item !== item.hasTag("is_armor")) {
                    container.getSlot(player.selectedSlotIndex).setLore([`${Lore}`])

                };
            } catch (error) {

            }
        }
        if (Lore !== undefined) {
            try {
                if (item.includes("helmet")) {
                    equipment.getEquipmentSlot("Head").setLore([`${Lore}`])


                } else if (item.includes("chestplate")) {
                    equipment.getEquipmentSlot("Chest").setLore([`${Lore}`])


                } else if (item.includes("leggings")) {
                    equipment.getEquipmentSlot("Legs").setLore([`${Lore}`])


                } else if (item.includes("boots")) {
                    equipment.getEquipmentSlot("Feet").setLore([`${Lore}`])

                };

            } catch (error) {

            }


        } else {
            return
        }

    };
    /**
     * 
     * @param {Player} player 
     * @param {ItemStack} item 
     * @param {ItemLockMode.inventory|ItemLockMode.none|ItemLockMode.slot} mode 
     * @author Gamer99
     * @description Sets the targeted items lock mode 
    
     */
    static setLockMode(player, item, mode) {
        /**
         * @type {container}
         */
        const equipment = player.getComponent("equippable")
        const container = player.getComponent("inventory").container;
        for (let i = 0; i < container.size; i++) {
            try {
                if (container.getSlot(i).typeId === `${item}`) {
                    container.getSlot(i).lockMode = `${mode}`
                } else if (item === container.getSlot(player.selectedSlotIndex).typeId) {
                    container.getSlot(player.selectedSlotIndex).lockMode = `${mode}`

                }
            } catch (error) {

            }
        }
        if (item.includes("helmet")) {
            equipment.getEquipmentSlot("Head").lockMode = `${mode}`


        } else if (item.includes("chestplate")) {
            equipment.getEquipmentSlot("Chest").lockMode = `${mode}`


        } else if (item.includes("leggings")) {
            equipment.getEquipmentSlot("Legs").lockMode = `${mode}`


        } else if (item.includes("boots")) {
            equipment.getEquipmentSlot("Feet").lockMode = `${mode}`

        };


    };
    /**
     * 
     * @param {Player|Block|Entity} inventoryType 
     * @param {ItemStack} item 
     * @param {number} amount 
     * @author Gamer99
     * @description Add Item to Inventory
     */
    static Additem(inventoryType, item, amount) {

        const container = inventoryType.getComponent("inventory").container;
        const equipment = inventoryType.getComponent("equippable");
        const armors = [
            "minecraft:diamond_helmet",
            "minecraft:leather_helmet",
            "minecraft:chainmail_helmet",
            "minecraft:iron_helmet",
            "minecraft:golden_helmet",
            "minecraft:netherite_helmet",
            "minecraft:turtle_helmet",
            "minecraft:iron_chestplate",
            "minecraft:diamond_chestplate",
            "minecraft:chainmail_chestplate",
            "minecraft:netherite_chestplate",
            "minecraft:leather_chestplate",
            "minecraft:golden_chestplate",
            "minecraft:chainmail_leggings",
            "minecraft:golden_leggings",
            "minecraft:netherite_leggings",
            "minecraft:iron_leggings",
            "minecraft:leather_leggings",
            "minecraft:diamond_leggings",
            "minecraft:iron_boots",
            "minecraft:diamond_boots",
            "minecraft:leather_boots",
            "minecraft:netherite_boots",
            "minecraft:chainmail_boots",
            "minecraft:golden_boots"



        ]
        if (!armors.includes(item)) {
            container?.addItem(new ItemStack(`${item}`, amount))

        }
        if (item.includes("helmet") && inventoryType instanceof Player || inventoryType instanceof Entity) {
            equipment?.setEquipment("Head", new ItemStack(`${item}`, 1))


        } else if (item.includes("chestplate") && inventoryType instanceof Player || inventoryType instanceof Entity) {
            equipment?.setEquipment("Chest", new ItemStack(`${item}`, 1))


        } else if (item.includes("leggings") && inventoryType instanceof Player || inventoryType instanceof Entity) {
            equipment?.setEquipment("Legs", new ItemStack(`${item}`, 1))


        } else if (item.includes("boots") && inventoryType instanceof Player || inventoryType instanceof Entity) {
            equipment?.setEquipment("Feet", new ItemStack(`${item}`, 1))

        };

    };
    /**
     * 
     * @param {Player} player 
     * @param {ItemStack} item 
     * @param {["identifier",value]} property 
     * @description Allows for easy setting of  dynamic properties to the Itemstack
     */
    static AddItemDynamicProperty(player, item, property) {
        const container = player.getComponent("inventory").container
        for (let i = 0; i < container.size; i++) {
            try {
                if (container.getSlot(i).typeId === `${item}` && container.getSlot(i).isStackable == false) {
                    container.getSlot(i).setDynamicProperty(`${property[0]}`, `${property[1]}`)
                } else if (item === item.typeId && container.getSlot(i).isStackable == false) {
                    container.getSlot(player.selectedSlotIndex).setDynamicProperty(`${property[0]}`, `${property[1]}`)

                }
            } catch (error) {

            }
        }

    };
    /**
     * 
     * @param {Block} block 
     * @param {String} State 
     * @param {string|number} value 
     * @author Gamer99
     * @description changes the block state of the block the player is looking at
     */
    static ChangeBlockState(block, State, value) {
      
        block.setPermutation(BlockPermutation.resolve(`${block.typeId}`).withState(`${State}`, `${value}`))


    };
    /**
     * 
     * @param {Player} player 
     * @param {ItemStack} item 
     * @param {number} value
     * @author Gamer99
     * @description reduces the durability of the item in hand  
     */
    static reduceDurability(player, item, value) {
        const dur = item.getComponent('durability');
        const eq = player.getComponent('equippable');
        const RemainingDurability = dur.maxDurability - dur.damage
        if (RemainingDurability > 0 && RemainingDurability > value) {
            dur.damage += value
            eq.setEquipment("Mainhand", item)

        } else if (value > RemainingDurability) {
            dur.damage += RemainingDurability
            eq.setEquipment("Mainhand", item)
            eq.setEquipment("Mainhand", undefined)
        }
    }
    /**
     * 
     * @param {Player} player 
     * @param {ItemStack} item 
     * @param {number} value 
     * @author Gamer99
     * @description increases the durability of the item in hand  
     * 
     */
    static increaseDurability(player, item, value) {
        const dur = item.getComponent('durability');
        const eq = player.getComponent('equippable');
        const RemainingDurability = dur.maxDurability - dur.damage
        const fulldurability = dur.maxDurability - RemainingDurability

        if (RemainingDurability !== dur.maxDurability && value < fulldurability) {
            dur.damage -= value
            eq.setEquipment("Mainhand", item)


        }
        if (value > fulldurability) {
            dur.damage -= fulldurability
            eq.setEquipment("Mainhand", item)

        }
    }
    /**
     * 
     * @param {Entity|Array<Entity<string>} entity 
     * @param {Array<string>} loot 
     * @param {number} amount 
     * @author Gamer99
     * @description adds custom loot drops to entity without editing the loot table 
     */
    static LootDrop(entity, loot, amount) {
        world.afterEvents.entityDie.subscribe(({ deadEntity: deadEntity }) => {
            for (let i = 0; i < loot.length; i++) {
                const items = loot[i];
                for (let e = 0; e < entity.length; e++) {
                    const entities = entity[e];
                    if (entities.includes(deadEntity.typeId)) {
                        deadEntity.dimension.spawnItem(new ItemStack(`${items}`, amount), deadEntity.location)

                    }
                };
                if (typeof entity === "string") {
                    deadEntity.dimension.spawnItem(new ItemStack(`${items}`, amount), deadEntity.location)

                }
            }


        })
    }
    /**
     * 
     * @param {Player} player 
     * @param {Entity<string>} entity 
     * @param {Vector3} location 
     * @param {number} amount 
     * @param {string} event 
     * @description Allows you to summon an entity and determine the how may to summon as well as running event on summon
     */
    static Summon(player, entity, location, amount, event) {
        for (let i = 0; i < amount; i++) {
            if (event === undefined) {
                player.dimension.spawnEntity(entity, location)

            } else {
                player.dimension.spawnEntity(entity, location).triggerEvent(`${event}`)

            }


        }
    };
    /**
     * 
     * @param {Player} player 
     * @param {EquipmentSlot} slot 
     * @param {Object} param2 
     * @param {string} param2.EnchantmentName 
     * @param {number} param2.level  
     * @author Gamer99
     * @description allows to add enchantments to armor
     */
    static addEnchantment(player, slot, { EnchantmentName, level }) {
        const equip = player.getComponent("equippable");
        const getSlot = equip.getEquipment(`${slot}`);
        const enchantable = getSlot.getComponent("enchantable");
        enchantable.addEnchantment({ type: new EnchantmentType(`${EnchantmentName}`), level: level })
        equip.setEquipment(`${slot}`, getSlot)



    };
    /**
     * @author Gamer99
     * @param {Entity|Player|Block} inventoryType 
     * @param {ItemStack} itemtype 
     * @description searches the player inventory for the item 
     * @example 
     * system.runInterval(()=>{
    for (const player of world.getAllPlayers()) {
        if (Utility.itemInInventory(player,"minecraft:apple")) {
           player.sendMessage("you have item")
        }
    }
})
     * @returns boolean
     * 
     */
    static itemInInventory(inventoryType, itemtype) {
        const inventory = inventoryType?.getComponent("inventory")?.container
        for (let i = 0; i < inventory?.size; i++) {
            const item = inventory?.getItem(i)
            if (item?.typeId !== itemtype || item === undefined) {
                continue
            } else if (item?.typeId === itemtype) {
                i++
                return true


            }

        }

    };
    /**
     * 
     * @param {Entity} Entitytype
     * @author Gamer99
     * @description Get the Entities Health
     */
    static getEntityHealth(Entitytype) {
        const health = Entitytype.getComponent("health")
        return health.currentValue
    }

    /**
     * 
     * @param {Entity} Entitytype 
     * @param {number} value 
     * @author Gamer99
     * @description Set The Entities Health
     * 
     * 
     */
    static setEntityHealth(Entitytype, value) {
        const health = Entitytype.getComponent("health")
        health.setCurrentValue(value)
    };
    /**
     * @author Gamer99
     * @description GetPlayer in the world without the need for a for loop
     * @returns Player
     * @example
     * system.runInterval(() => {
    const player = Utility.GetPlayer()
    if (player.isSneaking) {
          player.addEffect("speed",200,{showParticles:false,amplifier:0})
    }
})
     */
    static GetPlayer() {
        for (const player of world.getAllPlayers()) {

            return player


        }
    }
    /**
     * @author Gamer99
     * @param {import("@minecraft/server").EntityQueryOptions} options 
     * @description allows for filtered player searches without the use of a for loop
     * @example
     * system.runInterval(()=>{
        const player = Utility.GetQueryPlayer({tags:["test"]})
        player.sendMessage("test")
    
    })
     * 
     */
    static GetQueryPlayer(options) {
        for (const player of world.getPlayers(options)) {

            return player


        }
    };
    /**
     * @param {import("@minecraft/server").EntityQueryOptions} options 
     * @param {string|Entity.dimension.id|Player.dimension.id} dimension
     * @remarks Available dimensions "overworld","nether" or "the_end".
     * 
     * @returns entity
     */

    static getQueryEntity(dimension, options) {
        for (const entity of world.getDimension(dimension)?.getEntities(options)) {
            return entity
        }
    };
    /**
     * 
     * @param {Player|Block} inventoryType 
     * @param {ItemStack} item 
     * @param {Number} slot 
     * @param {Number} amount 
     */
    static setItemInInventory(inventoryType, item, slot, amount) {
        const inventory = inventoryType.getComponent("inventory").container
        inventory.setItem(slot, new ItemStack(item, amount))
    }


}