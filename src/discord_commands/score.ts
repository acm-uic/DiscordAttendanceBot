import { SlashCommandBooleanOption, SlashCommandBuilder } from "@discordjs/builders";
import Discord from "discord.js"
import ScoreController from "../controller";
import { IScore } from "../score-model";

/**
 * Command Object for handling /score with an optional show
 * @type {string}
 */
export const ScoreCommand = JSON.stringify(
    new SlashCommandBuilder()
        .setName('score')
        .setDescription('Get your score')
        .addBooleanOption(new SlashCommandBooleanOption()
            .setName("show")
            .setDescription("Show to other users")
            .setRequired(false)).toJSON()
)

/**
 * Checks a user's score and returns it to them, shows an error if they don't have a score
 * @param {Discord.CommandInteraction<Discord.CacheType>} interaction - Discord interaction object
 * @param {ScoreController} scorecontroller - Database controller object
 */
export async function ScoreCommandHandler(interaction: Discord.CommandInteraction<Discord.CacheType>, scorecontroller: ScoreController){
    let shouldShow: boolean | null = interaction.options.getBoolean('show', false);
    try {
        let scoreObj: IScore = await scorecontroller.getScoreByUserID(interaction.user.id)
        // Handle whether the score should be visible to everyone
        if(shouldShow){
            await interaction.reply({
                content: "Your score is: " + scoreObj.score
            })
        }else{
            await interaction.reply({
                content: "Your score is: " + scoreObj.score,
                ephemeral: true
            })
        }
    // The user may not exist
    } catch (error) {
        await interaction.reply({
            content: "You do not have a score, if you believe this is an error, please contact a mod",
            ephemeral: true
        })
    }
    
    
}