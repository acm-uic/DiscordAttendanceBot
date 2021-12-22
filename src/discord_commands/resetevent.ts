import { SlashCommandBuilder } from "@discordjs/builders"
import Discord, { GuildMemberRoleManager } from "discord.js"
import { options } from "../.."
import Middleware from "../../middleware"

/**
 * Reset the event
 * @type {string}
 */
export const ResetEventCommand = JSON.stringify(
    new SlashCommandBuilder()
        .setName("resetevent")
        .setDescription("Resets the currently active event").toJSON()
)

/**
 * Handler for resetting the an event (requires MOD permissions)
 * @param {Discord.CommandInteraction<Discord.CacheType>} interaction - Discord interaction object
 * @param {Middleware} middleware - Middleware object that calls handleResetEvent()
 * @param {options} options - Options object
 */
export async function ResetEventCommandHandler(interaction: Discord.CommandInteraction<Discord.CacheType>, middleware: Middleware, options: options): Promise<void> {
    // Check permissions
    if((interaction.member.roles as GuildMemberRoleManager).cache.has(options.ADMINROLEID) ||( options.MODROLEID && (interaction.member.roles as GuildMemberRoleManager).cache.has(options.MODROLEID))){
        console.log(interaction.user.id + " : " + interaction.user.tag + " requested event reset")
        await interaction.reply({
            content: "Event Reset",
            ephemeral: true
        })
        middleware.handleResetEvent();
    }else{
        await interaction.reply({
            content: "You do not have permissions to execute this!",
            ephemeral: true
        })
    }
}