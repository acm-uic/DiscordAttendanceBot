import { SlashCommandBuilder, SlashCommandNumberOption } from "@discordjs/builders";
import Discord, { GuildMemberRoleManager } from "discord.js"
import { options } from "../..";
import Middleware from "../../middleware";

/**
 * Create "startevent" command for handling starting an event
 * @type {string}
 */
export const StartEventCommand = JSON.stringify(
    new SlashCommandBuilder()
        .setName('startevent')
        .setDescription('Start an event (lasts for 1 hour)')
        .addNumberOption(new SlashCommandNumberOption()
            .setName('length')
            .setDescription('Length of event in minutes')
            .setRequired(true)).toJSON()
)

/**
 * Handles starting an event and permissions (MOD)
 * @param {Discord.CommandInteraction<Discord.CacheType>} interaction - Discord Interaction Object
 * @param {Middleware} middleware - Middleware object for handleStartEvent(number in milliseconds)
 * @param {options} options - Options object
 */
export async function StartEventCommandHandler(interaction: Discord.CommandInteraction<Discord.CacheType>, middleware: Middleware, options: options) {
    // Check if user has required permissions
    if((interaction.member.roles as GuildMemberRoleManager).cache.has(options.ADMINROLEID) ||( options.MODROLEID && (interaction.member.roles as GuildMemberRoleManager).cache.has(options.MODROLEID))){
        // Get length of time in minutes
        console.log(interaction.user.id + " : " + interaction.user.tag + " requested event start")
        let length: number = interaction.options.getNumber('length', true);
        await interaction.reply({
            content: String("Starting Event: " + new Date().toDateString()),
            ephemeral: true
        })
        middleware.handleStartEvent(length * 60000);
    }else{
        await interaction.reply({
            content: "You do not have permissions to execute this!",
            ephemeral: true
        })
    }
}