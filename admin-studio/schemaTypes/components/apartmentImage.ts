import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'apartmentImage',
  title: 'Apartment Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Description for accessibility',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional caption for the image',
    }),
    defineField({
      name: 'isMain',
      title: 'Main Image',
      type: 'boolean',
      description: 'Mark as the main image for the apartment',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      media: 'image',
      title: 'alt',
      subtitle: 'caption',
    },
    prepare(selection) {
      const { media, title, subtitle } = selection;
      return {
        title: title || 'Apartment Image',
        subtitle: subtitle,
        media: media,
      };
    },
  },
});
