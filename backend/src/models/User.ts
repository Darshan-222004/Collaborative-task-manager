import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { env } from '../config/env';

/**
 * Interface defining User document structure in TypeScript
 */
export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * Mongoose schema for User collection
 */
const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Pre-save middleware to hash password before storing
 */
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const saltRounds = parseInt(env.BCRYPT_SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(this.password, saltRounds);
        this.password = hashedPassword;
        next();
    } catch (error: any) {
        next(error);
    }
});

/**
 * Instance method to compare provided password with hashed password
 */
UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        return false;
    }
};

/**
 * Remove password from JSON output
 */
UserSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
    },
});

export const User = mongoose.model<IUser>('User', UserSchema);