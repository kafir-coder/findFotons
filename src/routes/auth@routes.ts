import {registerA, registerR, registerP, login,logout} from '../controllers/auth@controller';
import {Router} from 'express';
import {body} from 'express-validator';

const auth = Router();

auth.post('/Aregister', [
  body('name').exists().trim().escape(),
  body('location').exists().trim().escape().not().isEmpty(),
  body('contact').exists().trim().escape().not().isEmpty(),
  body('password').exists().trim().escape().not().isEmpty()]
, registerA);

auth.post('/Rregister', [
  body('name').exists().trim().escape(),
  body('birth').exists().trim().escape().not().isEmpty().trim(),
  body('contact').exists().trim().escape().not().isEmpty(),
  body('password').exists().trim().escape().not().isEmpty(),
  body('country').exists().trim().escape().not().isEmpty()]
, registerR);

auth.post('/Pregister', [
  body('name').exists().trim().escape(),
  body('birth').exists().trim().escape().not().isEmpty(),
  body('country').exists().trim().escape().not().isEmpty().trim(),
  body('styles').exists().trim().escape().not().isEmpty(),
  body('user_photo_url').exists().trim().escape().not().isEmpty(),
  body('password').exists().trim().escape().not().isEmpty(),
  body('employed').exists().trim().escape().not().isEmpty(),
  body('employer').exists().trim().escape().not().isEmpty(),
], registerP);

auth.post('/login', [
  body('contact').exists().trim().escape(),
  body('password').exists().trim().escape().not().isEmpty().trim(),
  body('role').exists().trim().escape().not().isEmpty().trim(),
], login);

auth.post('/logout', logout);

export default auth;