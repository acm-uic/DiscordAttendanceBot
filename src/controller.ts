import { connect, Types } from "mongoose";
import { IScore, Score} from "./score-model";

export default class ScoreController {
    private _address: string;
    private _dbName: string;
    private _user: string;
    private _pass: string;

    /**
     * ScoreController Constructor
     * @class
     * @param {string} address - Address of the database server
     * @param {string} dbName - Name of the database to use
     * @param {string} user - Username to connect to the db
     * @param {string} pass - Password to connect to the db
     */
    constructor(address: string, dbName: string, user: string, pass: string) {
        this._address = address;
        this._dbName = dbName;
        this._user = user;
        this._pass = pass;
    }

    /**
     * Ensure connection to database
     * @async
     * @private
     */
    private async _ConnectToDB() {
        await connect(this._address, {
            dbName: this._dbName,
            user: this._user,
            pass: this._pass,
        });
    }

    /**
     * Gets all of the users stored in the database
     * @async
     * @returns {Promise<IScore[]>} The list of users stored in the database
     */
    async getAllUsers(): Promise<IScore[]> {
        await this._ConnectToDB()
        const IScores: IScore[] = await Score.find()
        return IScores;
    }

    /**
     * Get the score of a user by their Discord ID
     * @async
     * @public
     * @param {string} id - ID of the user to get the score of
     * @returns {Promise<IScore>} The IScore object attached to the user
     */
    async getScoreByUserID(id: string): Promise<IScore> {
        await this._ConnectToDB()
        const ScoreByName: IScore | null = await Score.findOne({user: id});
        if(!ScoreByName) throw new Error("Invalid Name");
        return ScoreByName;
    }

    /**
     * Adds a user to the database
     * @async
     * @public
     * @param {string} id - User ID to create
     * @param {number} [initialScore] - Initial score (optional)
     * @returns {Promise<string>} The new object id
     */
    async addUser(id: string, initialScore?: number): Promise<string> {
        await this._ConnectToDB()
        let newid: Types.ObjectId = new Types.ObjectId();
        if(initialScore) await Score.create({_id: newid, user: id, score: initialScore})
        else await Score.create({_id: newid, user: id, score: 0})
        return newid.toString()
    }

    /**
     * Increment the score of the given user, and create the user if it doesn't exist already
     * @public
     * @async
     * @param id - Name of the user to increment or add
     * @returns {Promise<number>} The updated score
     */
    async incrementUserOrAdd(id: string): Promise<number> {
        await this._ConnectToDB()
        let User: IScore | null = await Score.findOne({user: id})

        // Check if user doesn't exist
        if(!User) {
            await this.addUser(id);
            User = await Score.findOne({user: id})
            if(!User){
                throw new Error("Error creating user");
            }
        }
        
        User.score = User.score+1
        User.save();
        return User.score;
    }

    /**
     * Manually sets the score for the given user
     * @public
     * @async
     * @param {string} id - Discord User ID
     * @param {number} score - Score to set for the user
     * @returns {Promise<number>} The score of the updated user
     */
    async setScore(id: string, score: number): Promise<number>{
        await this._ConnectToDB();
        let User: IScore | null = await Score.findOne({user: id})

        // Create the user if it doesn't exist
        if(!User) {
            await this.addUser(id);
            User = await Score.findOne({user: id})
            if(!User){
                throw new Error("Error creating user");
            }
        }
        User.score = score
        User.save();
        return User.score;
    }

    /**
     * Clear the database **DANGEROUS**
     * @public
     * @async
     */
    async clearDatabase(): Promise<void>{
        await this._ConnectToDB()
        await Score.deleteMany({});
    }
    
}