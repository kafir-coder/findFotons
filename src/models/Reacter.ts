import mongoose, {Schema} from 'mongoose';
import {hashSync, compareSync} from 'bcryptjs'
import {IReacter} from '../__constants__';

const ReacterSchema: (Schema | IReacter) = new Schema({
  name: String,
  birth: Object,
  contact: String,
  password: String,
  country: String
},{ timestamps: true });

ReacterSchema.methods = {
  _hashPassword(password: string) {
    return hashSync(password);
  },
  authenticateReacter(password: string) {
    return compareSync(password, this.password);
  },
  toJSON() {
    return {
      name: this.name,
      birth: this.birth,
      contact: this.contact,
      country: this.birth
    };
  },
};

ReacterSchema.pre('save', function(next) {
  // eslint-disable-next-line no-invalid-this
  if (this.isModified('password')) {
    // eslint-disable-next-line no-invalid-this
    this.password = this._hashPassword(this.password);
  }
  return next();
});

const Reacter = mongoose
    .model('Reacter', ReacterSchema);

export default Reacter;

