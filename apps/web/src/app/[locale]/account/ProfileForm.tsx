import { updateProfile } from '@/actions/account';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import toast from 'react-hot-toast';

// biome-ignore lint/suspicious/noExplicitAny: Profile structure is dynamic
export default function ProfileForm({ profile }: { profile: any }) {
  const t = useTranslations('Account');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      await updateProfile(formData);
      toast.success('Profile updated');
    } catch (e: any) {
      // biome-ignore lint/suspicious/noExplicitAny: Error handling
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? t('saving') : t('save')}
      </button>
    </form>
  );
}
