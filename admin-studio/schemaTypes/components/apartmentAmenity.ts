import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'apartmentAmenity',
  title: 'Apartment Amenity',
  type: 'object',
  fields: [
    defineField({
      name: 'amenity',
      title: 'Amenity',
      type: 'reference',
      to: [{ type: 'amenity' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'available',
      title: 'Available',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 2,
      description: 'Additional notes about this amenity',
    }),
  ],
  preview: {
    select: {
      amenityName: 'amenity.name',
      available: 'available',
      notes: 'notes',
    },
    prepare(selection) {
      const { amenityName, available, notes } = selection;
      return {
        title: amenityName,
        subtitle: `${available ? 'Available' : 'Not Available'}${notes ? ` - ${notes}` : ''}`,
      };
    },
  },
});
