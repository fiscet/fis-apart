import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'availabilityRequest',
  title: 'Availability Request',
  type: 'document',
  fields: [
    defineField({
      name: 'apartment',
      title: 'Apartment',
      type: 'reference',
      to: [{ type: 'apartment' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'userInfo',
      title: 'User Information',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Name',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'email',
          title: 'Email',
          type: 'string',
          validation: (Rule) => Rule.required().email(),
        },
        {
          name: 'phone',
          title: 'Phone',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'dates',
      title: 'Requested Dates',
      type: 'object',
      fields: [
        {
          name: 'checkIn',
          title: 'Check-in Date',
          type: 'date',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'checkOut',
          title: 'Check-out Date',
          type: 'date',
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: 'guests',
      title: 'Number of Guests',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'In Progress', value: 'in_progress' },
          { title: 'Responded', value: 'responded' },
          { title: 'Closed', value: 'closed' },
        ],
      },
      initialValue: 'new',
    }),
    defineField({
      name: 'adminNotes',
      title: 'Admin Notes',
      type: 'text',
      rows: 3,
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
      title: 'userInfo.name',
      apartment: 'apartment.name',
      status: 'status',
      createdAt: 'createdAt',
    },
    prepare(selection) {
      const { title, apartment, status, createdAt } = selection;
      return {
        title: `${title} - ${apartment}`,
        subtitle: `${status} | ${new Date(createdAt).toLocaleDateString()}`,
      };
    },
  },
});
