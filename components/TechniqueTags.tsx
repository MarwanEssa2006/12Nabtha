'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { NABTA_DATA } from '@/lib/data';
import type { TechniqueId } from '@/types/nabta';

interface TechniqueTagsProps {
  techniques: TechniqueId[];
  id?: string;
}

export function TechniqueTags({ techniques, id }: TechniqueTagsProps) {
  const { L } = useLanguage();

  return (
    <ul className="tags" id={id}>
      {techniques.map((k) => (
        <li key={k} className={`tag ${k}`}>
          {L(NABTA_DATA.techniques[k])}
        </li>
      ))}
    </ul>
  );
}
