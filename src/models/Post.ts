import mongoose, {Schema} from 'mongoose';
import {IPost} from '../__constants__';

const PostSchema: (Schema | IPost) = new Schema({
  photos: Array,
  tags: Array,
  owner: String,
  description: String
}, { timestamps: true });

PostSchema.methods = {
  toJSON() {
    return {
      _id: this._id,
      photos: this.photos,
      tags: this.tags,
      owner: this.owner,
      description: this.description
    };
  },
};

const Post = mongoose
    .model('Post', PostSchema);

export default Post;

