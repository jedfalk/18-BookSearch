import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IBook {
  bookId: string;
  authors?: string[];
  description?: string;
  title: string;
  image?: string;
  link?: string;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  savedBooks: IBook[];
  isCorrectPassword(password: string): Promise<boolean>;
}

const bookSchema = new Schema<IBook>({
  bookId: { type: String, required: true },
  authors: [String],
  description: String,
  title: { type: String, required: true },
  image: String,
  link: String,
});

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  password: { type: String, required: true },
  savedBooks: [bookSchema],
});

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isCorrectPassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
