'use client';

import React from 'react';
import SearchFilters from './SearchFilters';
import SearchChat from './SearchChat';
import { Button } from '@/components/ui/button';

export default function SearchSwitcher() {
  const [mode, setMode] = React.useState<'chat' | 'filters'>('chat');

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button variant={mode === 'chat' ? 'default' : 'outline'} onClick={() => setMode('chat')}>
          Chat
        </Button>
        <Button variant={mode === 'filters' ? 'default' : 'outline'} onClick={() => setMode('filters')}>
          Filters
        </Button>
      </div>
      {mode === 'chat' ? <SearchChat /> : <SearchFilters />}
    </div>
  );
}
