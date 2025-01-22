import Stripe from "stripe";
import { stripeSecretKey } from "../env/envoriment.js";

export const stripe = new Stripe(stripeSecretKey);
