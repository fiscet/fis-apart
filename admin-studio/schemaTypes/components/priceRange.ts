import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'priceRange',
  title: 'Price Range',
  type: 'object',
  fields: [
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (per night)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      options: {
        list: [
          { title: 'USD', value: 'USD' },
          { title: 'EUR', value: 'EUR' },
          { title: 'GBP', value: 'GBP' },
        ],
        layout: 'radio',
      },
      initialValue: 'EUR',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 2,
      description: 'Additional pricing notes',
    }),
  ],
  preview: {
    select: {
      startDate: 'startDate',
      endDate: 'endDate',
      price: 'price',
      currency: 'currency',
      notes: 'notes',
    },
    prepare(selection) {
      const { startDate, endDate, price, currency, notes } = selection;
      return {
        title: `${startDate} - ${endDate} | ${price} ${currency}`,
        subtitle: notes,
      };
    },
  },
});
