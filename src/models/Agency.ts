// @ts-nocheck
import mongoose, {Schema} from 'mongoose';
import {hashSync, compareSync} from 'bcryptjs'
import {IAgency} from '../__constants__';


const AgencySchema: (Schema | IAgency) = new Schema({
  name: String,
  location: String,
  contact: String,
  styles: String,
  password: String,
}, { timestamps: true });

AgencySchema.methods = {
  _hashPassword(password: string) {
    return hashSync(password);
  },
  authenticateAgency(password: string) {
    return compareSync(password, this.password);
  },
  toJSON() {
    return {
      _id: this._id,
      location: this.name,
      contact: this.status,
      styles: this.styles
    };
  },
};

AgencySchema.pre('save', function(next) {
  // eslint-disable-next-line no-invalid-this
  if (this.isModified('password')) {
    // eslint-disable-next-line no-invalid-this
    this.password = this._hashPassword(this.password);
  }
  return next();
});


const Agency = mongoose
    .model('Agency', AgencySchema);

export default Agency;

