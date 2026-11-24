import type { Metadata } from 'next';
import { DigitalCardExperience } from '@/components/DigitalCardExperience';
import { NABTA_I18N } from '@/lib/i18n';

export const metadata: Metadata = {
  title: NABTA_I18N.ar['cardPage.metaTitle'],
  description: NABTA_I18N.ar['cardPage.metaDescription'],
};

export default function DigitalCardPage() {
  return <DigitalCardExperience />;
}
