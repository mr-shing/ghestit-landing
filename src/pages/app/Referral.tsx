import { useState } from 'react';
import { Check, Copy, Gift, Share2, Users } from 'lucide-react';
import { useApi } from '../../lib/useApi';
import { toFaDigits } from '../../lib/format';
import { Card, ErrorState, Loading, PageHeader, StatusBadge } from './shared';

type Invite = {
  id: number;
  invitee: string | null;
  company: string | null;
  status: number;
  statusLabel: string;
  statusColor: string;
  createdAt: string | null;
  expiresAt: string | null;
};

type Reward = {
  id: number;
  label: string;
  role: number;
  roleLabel: string;
  status: number;
  statusLabel: string;
  statusColor: string;
  usable: boolean;
  expiresAt: string | null;
  note: string | null;
};

type Resp = {
  enabled: boolean;
  code: string;
  link: string;
  terms: {
    referrerReward: string;
    inviteeReward: string;
    attributionDays: number;
    rewardTtlDays: number;
    campaignEnd: string | null;
  };
  stats: { invited: number; pending: number; qualified: number; rewardsUsable: number };
  invites: Invite[];
  rewards: Reward[];
};

/** Copy button that confirms in place rather than firing a toast. */
function CopyButton({ value, label }: { value: string; label: string }) {
  const [done, setDone] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return; // Clipboard blocked (insecure origin): the text stays selectable.
    }
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white font-bold rounded-xl px-3 py-2 text-sm transition-colors"
    >
      {done ? <Check size={16} /> : <Copy size={16} />}
      {done ? 'کپی شد' : label}
    </button>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <Card className="p-4 text-center">
      <div className="text-2xl font-black text-slate-900">{toFaDigits(value)}</div>
      <div className="text-xs text-slate-500 mt-1">{label}</div>
    </Card>
  );
}

export default function Referral() {
  const { data, loading, error, refetch } = useApi<Resp>('referral');

  const share = async (link: string) => {
    if (!navigator.share) return;
    try {
      await navigator.share({ title: 'قسط‌یت', text: 'با این لینک در قسط‌یت ثبت‌نام کن', url: link });
    } catch {
      // The user dismissed the share sheet.
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorState msg={error} onRetry={refetch} />;
  if (!data) return <ErrorState msg="اطلاعات دعوت در دسترس نیست." onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title="دعوت دوستان"
        subtitle="کسب‌وکاری را معرفی کنید؛ وقتی اشتراک بخرد، هر دو هدیه می‌گیرید."
      />

      {/* Signature element of the page: the code itself. */}
      <div className="rounded-3xl bg-primary text-white p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-2 text-white/80 text-sm mb-3">
          <Share2 size={16} />
          کد دعوت شما
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            className="text-3xl sm:text-4xl font-black tracking-[0.2em] bg-white/15 rounded-2xl px-5 py-3 select-all"
            dir="ltr"
          >
            {data.code}
          </div>
          <div className="flex flex-wrap gap-2">
            <CopyButton value={data.code} label="کپی کد" />
            <CopyButton value={data.link} label="کپی لینک" />
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={() => share(data.link)}
                className="flex items-center gap-1.5 bg-white text-primary font-bold rounded-xl px-3 py-2 text-sm hover:bg-white/90 transition-colors"
              >
                <Share2 size={16} /> اشتراک‌گذاری
              </button>
            )}
          </div>
        </div>

        <p className="text-sm text-white/85 mt-4 leading-7">
          هر کسی با این کد ثبت‌نام کند و اشتراک بخرد: شما {data.terms.referrerReward} می‌گیرید و
          او {data.terms.inviteeReward} روی پرداخت بعدی‌اش. دعوت‌شده تا{' '}
          {toFaDigits(data.terms.attributionDays)} روز پس از ثبت‌نام فرصت خرید دارد
          {data.terms.rewardTtlDays > 0 && (
            <> و هدیه‌ها تا {toFaDigits(data.terms.rewardTtlDays)} روز اعتبار دارند</>
          )}
          .
          {data.terms.campaignEnd && (
            <> این کمپین تا <span dir="ltr">{toFaDigits(data.terms.campaignEnd)}</span> ادامه دارد.</>
          )}
        </p>

        {!data.enabled && (
          <p className="text-sm bg-white/15 rounded-xl px-3 py-2 mt-4">
            برنامه دعوت در حال حاضر فعال نیست؛ کد شما محفوظ می‌ماند.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Stat value={data.stats.invited} label="دعوت‌شده" />
        <Stat value={data.stats.pending} label="در انتظار خرید" />
        <Stat value={data.stats.qualified} label="خرید کرده" />
        <Stat value={data.stats.rewardsUsable} label="هدیه قابل استفاده" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h2 className="flex items-center gap-2 font-black text-slate-900 mb-4">
            <Users size={18} className="text-primary" /> دعوت‌های شما
          </h2>

          {!data.invites.length ? (
            <p className="text-sm text-slate-500 py-6 text-center">
              هنوز کسی با کد شما ثبت‌نام نکرده است. کد را برای همکارانتان بفرستید.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {data.invites.map((invite) => (
                <li key={invite.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-bold text-slate-800 text-sm" dir="ltr">
                      {invite.invitee ? toFaDigits(invite.invitee) : '—'}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 truncate">
                      {invite.company ?? 'هنوز کسب‌وکاری نساخته'}
                      {invite.createdAt && <> · {toFaDigits(invite.createdAt)}</>}
                    </div>
                  </div>
                  <StatusBadge text={invite.statusLabel} tone={invite.statusColor} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="flex items-center gap-2 font-black text-slate-900 mb-4">
            <Gift size={18} className="text-primary" /> هدیه‌های شما
          </h2>

          {!data.rewards.length ? (
            <p className="text-sm text-slate-500 py-6 text-center">
              هنوز هدیه‌ای ندارید. اولین خرید دعوت‌شده‌تان، اولین هدیه را می‌سازد.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {data.rewards.map((reward) => (
                <li key={reward.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-bold text-slate-800 text-sm">{toFaDigits(reward.label)}</div>
                    <div className="text-xs text-slate-500 mt-0.5 truncate">
                      {reward.note ?? reward.roleLabel}
                      {reward.expiresAt && (
                        <> · مهلت {toFaDigits(reward.expiresAt)}</>
                      )}
                    </div>
                  </div>
                  <StatusBadge text={reward.statusLabel} tone={reward.statusColor} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
