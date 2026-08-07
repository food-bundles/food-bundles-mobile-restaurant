import { common } from './common';
import { landing } from './landing';
import { guest } from './guest';
import { auth } from './auth';
import { shop } from './shop';
import { checkout } from './checkout';
import { orders } from './orders';
import { wallet } from './wallet';

export const rw = {
  ...common,
  ...landing,
  ...guest,
  ...auth,
  ...shop,
  ...checkout,
  ...orders,
  ...wallet,
};
