import { model, Schema, Model, Document, ObjectId, Types } from 'mongoose';

/**
 * @typedef {object} IScore
 * @extends Document
 * @property {ObjectId} _id - Randomly generated id
 * @property {string} user - Discord user ID string
 * @property {number} score - Discord user's score
 */
export interface IScore extends Document {
    _id: ObjectId,
    user: string,
    score: number
}

/**
 * @class IScore
 */
const ScoreSchema: Schema = new Schema({
    _id: {type: Types.ObjectId, required: true},
    user: {type: String, required: true},
    score: {type: Number, required: true}
})

/** @type {Model<IScore>} */
export const Score: Model<IScore> = model('scores', ScoreSchema);