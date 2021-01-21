// @ts-nocheck
import mongoose, {Schema} from 'mongoose';
import {hashSync, compareSync} from 'bcryptjs'
import {IPhotographer} from '../__constants__';

const PhotographerSchema: (Schema | IPhotographer) = new Schema({
  name: String,
  birth: Object,
  country: String,
  contact: String,
  password: String,
  styles: String,
  user_photo_url: String,
  employed: Boolean,
  employer: String
}, { timestamps: true });

PhotographerSchema.methods = {
  _hashPassword(password: string) {
    return hashSync(password);
  },
  authenticatePhotographer(password: string) {
    return compareSync(password, this.password);
  },
  toJSON() {
    return {
      id: this._id,
      name: this.name,
      birth: this.birth,
      contact: this.contact,
      country: this.country,
      styles: this.styles,
      user_photo_url: this.user_photo_url,
      employed: this.employed,
      employer: this.employer
    };
  },
};


PhotographerSchema.pre('save', function(next) {
  // eslint-disable-next-line no-invalid-this
  if (this.isModified('password')) {
    // eslint-disable-next-line no-invalid-this
    this.password = this._hashPassword(this.password);
  }
  return next();
});

const Photographer = mongoose
    .model('Photographer', PhotographerSchema);

export default Photographer;

