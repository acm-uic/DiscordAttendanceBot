import dotenv from "dotenv";
import ScoreController from "./src/controller";
import Bot from "./src/bot";

dotenv.config()

// Get environment vaiables
/** @type {string} */
const ADDRESS: string = process.env.ADDRESS || "mongodb://127.0.0.1:27017";
/** @type {string} */
const DB: string = process.env.DB || "bot";
/** @type {string} */
const USERNAME: string = process.env.DBUSER || "root";
/** @type {string} */
const PASSWORD: string = process.env.DBPASS || "example";

/**
 * @typedef {object} options
 * @property {string} DEPLOYMENT - Deployment type (production | development)
 * @property {string} TOKEN - Discord Bot Token
 * @property {string} CLIENTID - Discord OAUTH2 Application Client ID
 * @property {string} [GUILDID] - Guild ID for development testing
 * @property {string} ADMINROLEID - Role ID of the administrator role
 * @property {string} [MODROLEID] - Role ID of the moderator role
 * @property {string} [LEVEL1ROLEID] - Role ID for level 1 attendees
 * @property {string} [LEVEL2ROLEID] - Role ID for level 2 attendees
 * @property {string} [LEVEL3ROLEID] - Role ID for level 3 attendees
 * @property {string} [LEVEL4ROLEID] - Role ID for level 4 attendees
 */
export interface options {
    DEPLOYMENT: string,
    TOKEN: string,
    CLIENTID: string,
    GUILDID?: string,
    ADMINROLEID: string,
    MODROLEID?: string,
    LEVEL1ROLEID: string,
    LEVEL2ROLEID: string,
    LEVEL3ROLEID: string,
    LEVEL4ROLEID: string,
}

/**
 * Start the program
 */
function init() {
    let option: options = {
        DEPLOYMENT: process.env.DEPLOYMENT || "development",
        TOKEN: process.env.TOKEN!,
        CLIENTID: process.env.CLIENTID!,
        GUILDID: process.env.GUILDID,
        ADMINROLEID: process.env.ADMINROLEID!,
        MODROLEID: process.env.MODROLEID,
        LEVEL1ROLEID: process.env.LEVEL1ROLEID!,
        LEVEL2ROLEID: process.env.LEVEL2ROLEID!,
        LEVEL3ROLEID: process.env.LEVEL3ROLEID!,
        LEVEL4ROLEID: process.env.LEVEL4ROLEID!,
    }
    
    // Check required variables
    if((option.TOKEN == undefined || option.CLIENTID == undefined || option.ADMINROLEID == undefined || option.LEVEL1ROLEID == undefined || option.LEVEL2ROLEID == undefined || option.LEVEL3ROLEID == undefined || option.LEVEL4ROLEID == undefined)){
        throw new Error("Required parameters TOKEN, ClIENTID, ADMINROLEID not sufficient");
    }
    if(option.DEPLOYMENT == "development" && !option.GUILDID){
        throw new Error("Development mode requires GUILDID");
    }
    try {
        const db: ScoreController = new ScoreController(ADDRESS, DB, USERNAME, PASSWORD);
        console.log("Starting bot...")
        let bot = new Bot(db, option);
        bot.run();
    } catch (error) {
        console.log(error)
    }
}

init()
