// This file handles various verification checks

import Discord, { Client } from "discord.js"
import { options } from ".";
import ScoreController from "./src/controller";
import { IScore } from "./src/score-model";

export default class Middleware {
    private _time: number;
    private _lengthOfEvent: number;
    private _checkedIn: string[];
    private _scorecontroller: ScoreController
    private _client: Client
    private _options: options

    /**
     * Setup initial variables to use for handlers
     * @class
     * @param {ScoreController} scorecontroller - Database controller object
     */
    constructor(scorecontroller: ScoreController, client: Client, options: options) {
        this._client = client;
        this._options = options;
        this._time = 0;
        this._lengthOfEvent = 3600000;
        this._checkedIn = [];
        this._scorecontroller = scorecontroller
    }

    /**
     * Handler for calling handle start event
     * @public
     * @param {number} eventlength - Length of the event in milliseconds
     */
    public handleStartEvent(eventlength: number){
        this._time = Date.now();
        this._checkedIn = [];
        this._lengthOfEvent = eventlength;
    }

    /**
     * Handles when a user calls /here
     * @param {string} userid - The UID of the user checking in
     * @returns {boolean} Whether or not to accept the here request
     */
    public allowHere(userid: string): boolean{
        if(!this._checkedIn.includes(userid) && (Date.now() - this._time) < this._lengthOfEvent) {
            this._checkedIn.push(userid);
            return true;
        }
        return false;
    }

    /**
     * Handles the /resetevent command
     */
    public handleResetEvent(){
        this._time = 0;
    }

    /**
     * Checks and updates the role for the given user
     * @async
     * @param {Discord.GuildMember} user - The GuildMember object that needs its roles checked
     * @param {options} options - Options object
     */
    public async updateRole(user: Discord.GuildMember){
        // Get the users current score
        let score: IScore = await this._scorecontroller.getScoreByUserID(user.id)
        if(this._options.LEVEL1ROLEID){
            if(score.score > 0){
                user.roles.add(this._options.LEVEL1ROLEID);
            }else{
                user.roles.remove(this._options.LEVEL1ROLEID);
            }
        }

        if(this._options.LEVEL2ROLEID){
            if(score.score > 15){
                user.roles.add(this._options.LEVEL2ROLEID);
            }else{
                user.roles.remove(this._options.LEVEL2ROLEID);
            }
        }

        if(this._options.LEVEL3ROLEID){
            if(score.score > 30){
                user.roles.add(this._options.LEVEL3ROLEID);
            }else{
                user.roles.remove(this._options.LEVEL3ROLEID);
            }
        }

        if(this._options.LEVEL4ROLEID){
            if(score.score > 70){
                user.roles.add(this._options.LEVEL4ROLEID);
            }else{
                user.roles.remove(this._options.LEVEL4ROLEID);
            }
        }

    }

    /**
     * Clears all of the roles from the users in the database (this is run directly before the database is cleared)
     * @async
     * @param {Discord.CommandInteraction<Discord.CacheType>} interaction The discord interaction object
     */
    public async clearAllRoles(interaction: Discord.CommandInteraction<Discord.CacheType>){
        // Remove all roles for users\
        const scores: IScore[] = await this._scorecontroller.getAllUsers();
        scores.forEach(async user => {
            const duser = await interaction.guild?.members.cache.get(user.user);
            duser?.roles.remove(this._options.LEVEL1ROLEID!)
            duser?.roles.remove(this._options.LEVEL2ROLEID!)
            duser?.roles.remove(this._options.LEVEL3ROLEID!)
            duser?.roles.remove(this._options.LEVEL4ROLEID!)
        })
    }
    
}