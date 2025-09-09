import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'location',
  title: 'Location',
  type: 'object',
  fields: [
    defineField({
      name: 'lat',
      title: 'Latitude',
      type: 'number',
      validation: (Rule) => Rule.min(-90).max(90),
    }),
    defineField({
      name: 'lng',
      title: 'Longitude',
      type: 'number',
      validation: (Rule) => Rule.min(-180).max(180),
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
      description: 'Full address for display',
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
    }),
    defineField({
      name: 'postalCode',
      title: 'Postal Code',
      type: 'string',
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      initialValue: 'Italy',
    }),
  ],
  preview: {
    select: {
      address: 'address',
      city: 'city',
      lat: 'lat',
      lng: 'lng',
    },
    prepare(selection) {
      const { address, city, lat, lng } = selection;
      return {
        title: address || city || 'Location',
        subtitle: lat && lng ? `${lat.toFixed(4)}, ${lng.toFixed(4)}` : 'Coordinates not set',
      };
    },
  },
});
