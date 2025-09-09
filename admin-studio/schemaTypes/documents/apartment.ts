import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'apartment',
  title: 'Apartment',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
        },
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'apartmentImage' }],
      validation: (Rule) => Rule.max(10),
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'reference',
      to: [{ type: 'city' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'location',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'amenities',
      title: 'Amenities',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'amenity' }] }],
    }),
    defineField({
      name: 'experienceCategory',
      title: 'Experience Category',
      type: 'reference',
      to: [{ type: 'experienceCategory' }],
    }),
    defineField({
      name: 'pricePeriods',
      title: 'Price Periods',
      type: 'array',
      of: [{ type: 'priceRange' }],
    }),
    defineField({
      name: 'capacity',
      title: 'Capacity',
      type: 'object',
      fields: [
        {
          name: 'minGuests',
          title: 'Minimum Guests',
          type: 'number',
          validation: (Rule) => Rule.min(1),
        },
        {
          name: 'maxGuests',
          title: 'Maximum Guests',
          type: 'number',
          validation: (Rule) => Rule.min(1),
        },
        {
          name: 'bedrooms',
          title: 'Bedrooms',
          type: 'number',
          validation: (Rule) => Rule.min(1),
        },
        {
          name: 'bathrooms',
          title: 'Bathrooms',
          type: 'number',
          validation: (Rule) => Rule.min(1),
        },
      ],
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      city: 'city.name',
      media: 'images.0.image',
    },
    prepare(selection) {
      const { title, city, media } = selection;
      return {
        title: title,
        subtitle: city,
        media: media,
      };
    },
  },
});
