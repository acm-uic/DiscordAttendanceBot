import { SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandUserOption } from "@discordjs/builders";
import Discord, { GuildMemberRoleManager, Interaction, RoleManager } from "discord.js"
import { options } from "../..";
import Middleware from "../../middleware";
import ScoreController from "../controller";

/**
 * Create "Override" command which accepts a user and a score
 * @type {string}
 */
export const OverrideCommand = JSON.stringify(
    new SlashCommandBuilder()
        .setName("override")
        .setDescription("Override a user's score (administrator only)")
        .addUserOption(new SlashCommandUserOption()
            .setName("user")
            .setDescription("User to modify points for")
            .setRequired(true))
        .addIntegerOption(new SlashCommandIntegerOption()
            .setName("score")
            .setDescription("The score to set")
            .setRequired(true)).toJSON()  
)

/**
 * Handles overriding score for a given user, checks admin role for execute permissions
 * @async
 * @param {Discord.CommandInteraction<Discord.CacheType>} interaction - Discord Interaction Object
 * @param {ScoreController} scorecontroller - Database controller
 * @param {Middleware} middleware - Middleware controller to add interaction
 * @param {options} options - Global options object
 */
export async function OverrideCommandHandler(interaction: Discord.CommandInteraction<Discord.CacheType>, scorecontroller: ScoreController, middleware: Middleware, options: options){

    const user: Discord.User = interaction.options.getUser('user', true);
    const score: number = interaction.options.getInteger('score', true);

    const roles: GuildMemberRoleManager = interaction.member.roles as GuildMemberRoleManager
    if(roles.cache.has(options.ADMINROLEID)){
        console.log(interaction.user.id + " : " + interaction.user.tag + " overrode user: " + user.tag);
        scorecontroller.setScore(user.id, score);
        await interaction.reply({
            content: "User: " + user.username + " now has a score of: " + score,
            ephemeral: true
        })
        // Check and update the roles of the user
        await middleware.updateRole((await interaction.guild?.members.fetch(user))!)
    }else{
        await interaction.reply({
            content: "You do not have permission to access this!",
            ephemeral: true,
        })
    }
}