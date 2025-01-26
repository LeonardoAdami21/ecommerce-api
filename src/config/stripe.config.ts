import Stripe from "stripe";
import { stripeSecretKey } from "../env/envoriment";

export const stripe = new Stripe(stripeSecretKey);
