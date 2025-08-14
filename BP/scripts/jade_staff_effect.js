import { world, system } from "@minecraft/server";
import { Utility } from "./utility.js";

export class JadeStaffEffect {
    static EFFECT_RADIUS = 8; // Blocks
    static POISON_DURATION = 200; // 10 seconds
    static POISON_AMPLIFIER = 4; // Fatal poison level
    
    static isHostileMob(entity) {
        if (!entity || !entity.typeId) return false;
        
        const hostileMobs = [
            "minecraft:zombie",
            "minecraft:skeleton",
            "minecraft:creeper",
            "minecraft:spider",
            "minecraft:cave_spider",
            "minecraft:witch",
            "minecraft:enderman",
            "minecraft:phantom",
            "minecraft:drowned",
            "minecraft:husk",
            "minecraft:stray",
            "minecraft:wither_skeleton",
            "minecraft:blaze",
            "minecraft:ghast",
            "minecraft:magma_cube",
            "minecraft:silverfish",
            "minecraft:guardian",
            "minecraft:elder_guardian",
            "minecraft:vex",
            "minecraft:vindicator",
            "minecraft:evoker",
            "minecraft:pillager",
            "minecraft:ravager",
            "minecraft:shulker",
            "minecraft:hoglin",
            "minecraft:piglin",
            "minecraft:piglin_brute",
            "minecraft:zoglin",
            "minecraft:strider",
            "minecraft:wither",
            "minecraft:endermite",
            "minecraft:warden"
        ];
        
        return hostileMobs.some(mob => entity.typeId.includes(mob));
    }
    
    static applyFatalPoisonToNearbyMobs(player) {
        try {
            const dimension = player.dimension;
            const playerLocation = player.location;
            
            // Get all entities within radius
            const entities = dimension.getEntities({
                location: playerLocation,
                maxDistance: this.EFFECT_RADIUS,
                type: "minecraft:monster"
            });
            
            let affectedMobs = 0;
            
            for (const entity of entities) {
                if (this.isHostileMob(entity)) {
                    // Apply fatal poison effect
                    Utility.addEffect(
                        entity, 
                        "minecraft:fatal_poison", 
                        this.POISON_DURATION, 
                        true, 
                        this.POISON_AMPLIFIER
                    );
                    
                    // Add visual effect
                    entity.dimension.spawnParticle(
                        "minecraft:poison_cloud_particle",
                        entity.location
                    );
                    
                    affectedMobs++;
                }
            }
            
            if (affectedMobs > 0) {
                // Play sound effect
                player.playSound("random.orb");
                
                // Show effect to player
                player.onScreenDisplay.setTitle("§aJade Staff Activated!", {
                    fadeInDuration: 5,
                    stayDuration: 20,
                    fadeOutDuration: 5
                });
                
                // Reduce durability
                const mainHandItem = Utility.Getitem(player, "hand");
                if (mainHandItem === "arw:jade_staff") {
                    const equipment = player.getComponent("equippable");
                    const item = equipment.getEquipment("Mainhand");
                    if (item) {
                        Utility.reduceDurability(player, item, 1);
                    }
                }
            }
            
            return affectedMobs;
            
        } catch (error) {
            console.warn(`Error applying jade staff effect: ${error}`);
            return 0;
        }
    }
    
    static createPoisonCloudEffect(player) {
        try {
            const dimension = player.dimension;
            const playerLocation = player.location;
            
            // Create poison cloud particles
            for (let i = 0; i < 20; i++) {
                const angle = (i / 20) * Math.PI * 2;
                const radius = this.EFFECT_RADIUS * 0.8;
                const x = playerLocation.x + Math.cos(angle) * radius;
                const z = playerLocation.z + Math.sin(angle) * radius;
                const y = playerLocation.y + 1;
                
                dimension.spawnParticle(
                    "minecraft:poison_cloud_particle",
                    { x, y, z }
                );
            }
            
            // Create green aura effect
            dimension.spawnParticle(
                "minecraft:enchanting_table_particle",
                playerLocation
            );
            
        } catch (error) {
            console.warn(`Error creating poison cloud effect: ${error}`);
        }
    }
}
