import { useSeo } from '@/hooks/useSeo';
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from '@/constants/seo';
import { useAppStore } from '@/store/appStore';

/** @deprecated Prefer useSeo — mantido para páginas legais */
export function usePageMeta({ title, description = DEFAULT_DESCRIPTION }) {
  const { lang } = useAppStore();
  useSeo({ title, description, lang });
}

export { DEFAULT_DESCRIPTION, DEFAULT_TITLE };
