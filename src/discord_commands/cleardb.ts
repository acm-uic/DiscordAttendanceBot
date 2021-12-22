import { SlashCommandBuilder } from "@discordjs/builders"
import Discord, { CacheType, GuildMemberRoleManager, MessageActionRow, MessageButton, MessageComponentInteraction } from "discord.js"
import { options } from "../.."
import Middleware from "../../middleware"
import ScoreController from "../controller"

/**
 * Creates a command that will clear the database
 * @type {string}
 */
export const ClearCommand = JSON.stringify(
    new SlashCommandBuilder()
        .setName("cleardb")
        .setDescription("Clear the database **DANGEROUS**")
)

/**
 * Handles the command for clearing, showing a warning message upon execution and requiring confirmation
 * @param {Discord.CommandInteraction<Discord.CacheType>} interaction - Discord Interaction Object
 * @param {ScoreController} scorecontroller - Database Controller
 * @param {Middleware} middleware - Middleware controller
 * @param {options} options - Environment options object
 */
export async function ClearCommandHandler(interaction: Discord.CommandInteraction<Discord.CacheType>, scorecontroller: ScoreController, middleware: Middleware, options: options): Promise<void> {
    if((interaction.member.roles as GuildMemberRoleManager).cache.has(options.ADMINROLEID)){
        console.log(interaction.user.id + " : " + interaction.user.tag + " requested database clear!")
        // Create Confirm/Cancel buttons
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("clear_yes")
                    .setEmoji('⚠️')
                    .setLabel("Confirm")
                    .setStyle('DANGER')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId("clear_no")
                    .setLabel("Cancel")
                    .setStyle('PRIMARY')
            )
        // Reply with the attached buttons
        await interaction.reply({
            content: "Are you sure?",
            components: [row],
            ephemeral: true,
        })

        // Ensures that the user clicking the button is the one who initially made the interaction
        const filterUser = (butInt: MessageComponentInteraction<CacheType>): boolean => interaction.user.id === butInt.user.id
        
        // Collector will complete after 10 seconds or 1 click
        const collector = interaction.channel?.createMessageComponentCollector({
            filter: filterUser,
            max: 1,
            time: 1000 * 10,
        })

        // Handle button clicks
        collector?.on('end', async (collection: Discord.Collection<string, Discord.MessageComponentInteraction<Discord.CacheType>>) => {
            // Check which button is clicked
            if(collection.first()?.customId === "clear_yes"){
                console.log(interaction.user.id + " : " + interaction.user.tag + " confirmed databse clear")
                await middleware.clearAllRoles(interaction);
                await scorecontroller.clearDatabase();
                await interaction.editReply({
                    content: "Database Cleared!",
                    components: []
                })
            }else{
                await interaction.editReply({
                    content: "Cancelled",
                    components: []
                })
            }
        })
    }else{
        console.log(interaction.user.id + " : " + interaction.user.tag + " attempted to clear the database")
        await interaction.reply({
            content: "You do not have permissions to execute this! This action will be logged!",
            ephemeral: true
        })
    }
}