import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'chatWithAgents',
  title: 'Chat with agents',
  type: 'document',
  fields: [
    defineField({ name: 'sessionId', title: 'Session ID', type: 'string' }),
    defineField({
      name: 'messages',
      title: 'Messages',
      type: 'array',
      of: [{
        type: 'object',
        name: 'chatItem',
        fields: [
          defineField({
            name: 'role',
            title: 'Role',
            type: 'string',
            options: {
              list: [
                { title: 'User', value: 'user' },
                { title: 'Assistant', value: 'assistant' }
              ],
              layout: 'radio'
            }
          }),
          defineField({ name: 'message', title: 'Message', type: 'text' }),
          defineField({ name: 'context', title: 'Context', type: 'text' }),
          defineField({ name: 'result', title: 'Result', type: 'text' })
        ]
      }]
    })
  ],
  preview: {
    select: { title: 'sessionId' }
  }
});


