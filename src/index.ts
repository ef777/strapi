import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Bootstrap is empty - no auto seed data
    // Configure permissions manually via Strapi Admin Panel:
    // Settings -> Users & Permissions -> Roles -> Public
    console.log(' Strapi baþlatýldý');
  },
};
