import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import Discord, { GuildMember, GuildMemberRoleManager } from "discord.js";
import { options } from "../..";
import Middleware from "../../middleware";
import ScoreController from "../controller";

/** 
 * Creates a command "here" with a user option
 * @type {string}
 */
export const HereCommand: string = JSON.stringify(
    new SlashCommandBuilder()
        .setName("here")
        .setDescription("Counts meeting attendance, with optional user")
        .addUserOption(new SlashCommandUserOption()
            .setName("user")
            .setDescription("User to add a point to (SIG Leader ONLY)")
            .setRequired(false)).toJSON())

/**
 * Handles Hero command which accepts a user. Handles checking permissions for caller.
 * @async
 * @param {Discord.CommandInteraction<Discord.CacheType>} interaction - The interaction object from the Discord API
 * @param {ScoreController} scorecontroller - The database object
 * @param {Middleware} middleware - Middleware object for allowHere()
 * @param {options} options - Options object
 */
export async function HereCommandHandler(interaction: Discord.CommandInteraction<Discord.CacheType>, scorecontroller: ScoreController, middleware: Middleware, options: options): Promise<void> {
    const user = interaction.options.getUser('user')
    // Handle optional user option
    if(!user){
        // Check if action is allowed by user
        if(middleware.allowHere(interaction.user.id)){
            let newScore: number = await scorecontroller.incrementUserOrAdd(interaction.user.id);
            await interaction.reply({
                content: String("You now have a score of: " + newScore),
                ephemeral: true
            });
            // CHeck and update the roles of the user
            await middleware.updateRole(interaction.member as GuildMember);
        }else{
            await interaction.reply({
                content: "There is no ongoing event at the moment, or you have already checked in!",
                ephemeral: true
            })
        }
        
    }else{
        // Check permissions
        if((interaction.member.roles as GuildMemberRoleManager).cache.has(options.ADMINROLEID) ||( options.MODROLEID && (interaction.member.roles as GuildMemberRoleManager).cache.has(options.MODROLEID))){
            console.log(interaction.user.id + " : " + interaction.user.tag + " has updated user: " + user.tag)
            let newScore: number = await scorecontroller.incrementUserOrAdd(user.id);
            await interaction.reply({
                content: String("User: " + user.username + " now has a score of: " + newScore),
                ephemeral: true
            });
            // Update role
            await middleware.updateRole((await interaction.guild?.members.fetch(user))!);
        }else{
            await interaction.reply({
                content: "You do not have permission to execute this!",
                ephemeral: true
            })

        }
        
    }
    return;
    
}