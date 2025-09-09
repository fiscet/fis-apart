import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'amenity',
  title: 'Amenity',
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
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Icon name (e.g., wifi, parking, pool)',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Basic', value: 'basic' },
          { title: 'Kitchen', value: 'kitchen' },
          { title: 'Bathroom', value: 'bathroom' },
          { title: 'Entertainment', value: 'entertainment' },
          { title: 'Outdoor', value: 'outdoor' },
          { title: 'Safety', value: 'safety' },
          { title: 'Accessibility', value: 'accessibility' },
        ],
      },
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      category: 'category',
    },
    prepare(selection) {
      const { title, category } = selection;
      return {
        title: title,
        subtitle: category,
      };
    },
  },
});
