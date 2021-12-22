import Discord, { Client, Guild, GuildManager, GuildMember, Intents } from "discord.js";
import ScoreController from "./controller";
import { Routes } from "discord-api-types/v9";
import { REST } from "@discordjs/rest";
import { HereCommand, HereCommandHandler } from "./discord_commands/here";
import { OverrideCommand, OverrideCommandHandler } from "./discord_commands/override";
import { StartEventCommand, StartEventCommandHandler } from "./discord_commands/startevent";
import { ResetEventCommand, ResetEventCommandHandler } from "./discord_commands/resetevent";
import { ClearCommand, ClearCommandHandler } from "./discord_commands/cleardb";
import Middleware from "../middleware";
import { ScoreCommand, ScoreCommandHandler } from "./discord_commands/score";
import { options } from "..";


export default class Bot {
    /** @private @type {ScoreController} */
    private _scorecontroller: ScoreController
    /** @private @type {Client} */
    private _client: Client
    /** @private @type {REST} */
    private _rest: REST;
    /** @private @type {string[]} */
    private _commands: string[]

    private _middleware: Middleware

    private _options: options

    /**
     * @constructor
     * @param {ScoreController} scorecontroller - Database controller object
     * @param {options} options - Options Object
     */
    constructor(scorecontroller: ScoreController, options: options) {
        this._scorecontroller = scorecontroller;
        this._options = options;
        this._client = new Discord.Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
        this._client.login(this._options.TOKEN);
        this._rest = new REST({version: "9"}).setToken(options.TOKEN)
        this._middleware = new Middleware(scorecontroller, this._client, this._options);

        // Add commands here
        this._commands = [
            HereCommand, 
            OverrideCommand, 
            StartEventCommand,
            ResetEventCommand,
            ClearCommand,
            ScoreCommand
        ].map(command => JSON.parse(command));

        console.log("Bot Created!")
    }

    /**
     * Puts the custom commands into the REST api
     * @private
     * @async
     */
    private async _buildCommands(){
        try {
            if(this._options.DEPLOYMENT == "development"){
                // Send commands to the discord API for the specified guild
                await this._rest.put(Routes.applicationGuildCommands(this._options.CLIENTID, this._options.GUILDID!), {
                    body: this._commands
                })
            }else{
                // Send commands to the discord API for global use
                await this._rest.put(Routes.applicationCommands(this._options.CLIENTID), {
                    body: this._commands
                })
            }
            
            console.log("Successfully loaded commands!")
        } catch (error) {
            console.log(String(error))
        }
        
    }

    /**
     * Starts listening for actions to the Discord API
     * @public
     */
    public run(){
        this._buildCommands();
        
        // When the discord bot is logged in, show its name and tag
        this._client.on('ready', () => {
            console.log(`Logged in as ${this._client.user!.tag}`);
        });

        this._client.on('interactionCreate', async interaction => {
            if (!interaction.isCommand()) return;

            // Checks the command, and sends it to its respective handler
            switch (interaction.commandName) {
                case "here":
                    await HereCommandHandler(interaction, this._scorecontroller, this._middleware, this._options);
                    break;
                case "override":
                    await OverrideCommandHandler(interaction, this._scorecontroller, this._middleware, this._options);
                    break;
                case "startevent":
                    await StartEventCommandHandler(interaction, this._middleware, this._options);
                    break;
                case "resetevent":
                    await ResetEventCommandHandler(interaction, this._middleware, this._options);
                    break;
                case "cleardb":
                    await ClearCommandHandler(interaction, this._scorecontroller, this._middleware, this._options);
                    break;
                case "score":
                    await ScoreCommandHandler(interaction, this._scorecontroller);
                    break;
                default:
                    break;
            }
        })
    }
}