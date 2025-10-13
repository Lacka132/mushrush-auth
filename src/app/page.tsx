"use client";

import React, { useMemo, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

// -----------------------------------------------------------------------------
// MushRush — Early Access Landing (React + Tailwind + NextAuth Twitter Login)
// -----------------------------------------------------------------------------

export default function EarlyAccessPage() {
const sessionHook = typeof window !== "undefined" ? useSession() : null;
const session = sessionHook?.data;
const isSignedIn = !!session;
  const wallet = session?.user?.name || null;

  // Referral state
  const [referralInput, setReferralInput] = useState("");
  const [myReferral, setMyReferral] = useState("RF-XXXX");
  const maskedWallet = useMemo(() => (wallet ? maskWallet(wallet) : "0x…hidden"), [wallet]);

  // Tasks state
  const [joinedDiscord, setJoinedDiscord] = useState(false);
  const [sharedCard, setSharedCard] = useState(false);
  const [followedX, setFollowedX] = useState(false);
  const completed = [joinedDiscord, sharedCard, followedX].filter(Boolean).length;

  const canRegister = isSignedIn && referralInput.trim().length > 0 && completed === 3;

  function handleCopyRef() {
    const refText = `${myReferral}`;
    navigator.clipboard.writeText(refText);
  }

  function applyReferral() {
    alert(`Applied referral: ${referralInput}`);
  }

  function register() {
    alert("Registered for Early Access! You'll move up as you complete tasks and share.");
  }

  function shareOnX() {
    const text = encodeURIComponent(
      `I'm joining MushRush Early Access! Use my referral ${myReferral} to climb the queue.`
    );
    const url = encodeURIComponent("https://mushrushsignup.netlify.app");
    const via = "mushrush";
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}&via=${via}`, "_blank");
  }

  function downloadCard() {
    alert("Download coming soon (export card as PNG)");
  }

  return (
    <div className="min-h-screen w-full bg-[#0b0a12] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#7b3cff] grid place-items-center font-bold">
              M
            </div>
            <div>
              <div className="text-lg font-semibold">MushRush — Early Access</div>
              <div className="text-sm text-white/60">
                Marketing landing • Share to climb the queue
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (isSignedIn) signOut();
                else signIn("twitter");
              }}
              className="rounded-xl bg-white px-4 py-2 text-black hover:bg-white/90"
            >
              {isSignedIn
                ? `Sign out (${session?.user?.name || "user"})`
                : "Sign in with X"}
            </button>
            <button
              onClick={handleCopyRef}
              className="rounded-xl bg-[#7b3cff] px-4 py-2 hover:bg-[#6c34e0]"
            >
              Copy ref
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left Column */}
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#c59cff]">
              GET EARLY ACCESS
            </h1>
            <p className="mt-3 max-w-prose text-white/70">
              Complete a few simple tasks and share your referral to move up the early access queue.
            </p>

            {/* Referral input */}
            <div className="mt-6">
              <label className="mb-2 block text-sm text-white/70">
                Referral code/address is required to register
              </label>
              <div className="flex gap-2">
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/40 focus:ring-2 focus:ring-[#7b3cff]"
                  placeholder="Enter referral code or wallet address (required)"
                  value={referralInput}
                  onChange={(e) => setReferralInput(e.target.value)}
                />
                <button
                  onClick={applyReferral}
                  className="rounded-xl bg-white/10 px-4 py-2 hover:bg-white/15"
                >
                  Apply
                </button>
              </div>
              <div className="mt-2 text-sm text-white/60">
                Your referral:{" "}
                <span className="font-semibold text-[#c7a6ff]">{myReferral}</span>{" "}
                <span className="ml-1">{maskedWallet}</span>
              </div>
            </div>

            {/* Tasks */}
            <div className="mt-8 space-y-4">
              <TaskRow
                label="Join our Discord"
                done={joinedDiscord}
                onAction={() => setJoinedDiscord(true)}
                actionLabel="Join"
                link="https://discord.gg/your-server"
              />
              <TaskRow
                label="Share your referral card"
                done={sharedCard}
                onAction={() => {
                  setSharedCard(true);
                  shareOnX();
                }}
                actionLabel="Share"
              />
              <TaskRow
                label="Follow us on X"
                done={followedX}
                onAction={() => {
                  setFollowedX(true);
                  window.open("https://x.com/your-handle", "_blank");
                }}
                actionLabel="Follow"
              />
            </div>

            {/* Progress + CTAs */}
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-white/60">{completed} / 3 tasks completed</div>
              <div className="flex items-center gap-3">
                <button
                  disabled={!canRegister}
                  onClick={register}
                  className={
                    "rounded-xl px-5 py-3 text-sm font-semibold transition " +
                    (canRegister
                      ? "bg-[#7b3cff] hover:bg-[#6c34e0]"
                      : "bg-white/10 text-white/40 cursor-not-allowed")
                  }
                >
                  Register for Early Access
                </button>
                <button
                  onClick={shareOnX}
                  className="rounded-xl bg-white/10 px-4 py-3 text-sm hover:bg-white/15"
                >
                  Share on X
                </button>
              </div>
            </div>
          </div>

          {/* Right Column — Player Card */}
          <div>
            <div className="sticky top-8 rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-end gap-2">
                <IconButton onClick={downloadCard} title="Download" icon={DownloadIcon} />
                <IconButton onClick={() => alert("Close card")} title="Close" icon={CloseIcon} />
              </div>

              <div className="mt-2 rounded-2xl border border-white/10 bg-gradient-to-br from-[#7b3cff] via-[#8e54ff] to-[#5a24d6] p-3">
                <div className="rounded-xl bg-[#9e75ff]/30 p-2">
                  <CardArt />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <div>
                  <div className="text-white/70">ID: (hidden)</div>
                  <div className="mt-1 font-semibold">
                    {isSignedIn ? "Registered" : "Not registered"}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-black/30 p-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <div className="font-medium">Complete all tasks to move up the queue</div>
                </div>
                <p className="mt-2 text-sm text-white/70">
                  Share your card on X to attract referrals — referrals boost your access priority.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Subcomponents
// -----------------------------------------------------------------------------

function TaskRow({
  label,
  done,
  onAction,
  actionLabel,
  link,
}: {
  label: string;
  done: boolean;
  onAction: () => void;
  actionLabel: string;
  link?: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-3">
        <span
          className={`grid h-5 w-5 place-items-center rounded-full border ${
            done
              ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
              : "border-white/20 bg-transparent text-transparent"
          }`}
        >
          ✓
        </span>
        <div className="font-medium">{label}</div>
      </div>
      <button
        onClick={() => {
          if (link) window.open(link, "_blank");
          onAction();
        }}
        className={`rounded-xl px-4 py-2 text-sm ${
          done
            ? "bg-white/10 text-white/40 cursor-not-allowed"
            : "bg-[#7b3cff] hover:bg-[#6c34e0]"
        }`}
        disabled={done}
      >
        {actionLabel}
      </button>
    </div>
  );
}

function IconButton({
  onClick,
  title,
  icon: Icon,
}: {
  onClick: () => void;
  title: string;
  icon: any;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10"
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}

function DownloadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M20 21H4" />
    </svg>
  );
}

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function CardArt() {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-xl">
      <div className="absolute inset-2 rounded-xl border-4 border-white/80"></div>
      <div className="absolute inset-0 grid place-items-center">
        <div className="h-2/3 w-2/3 rounded-3xl bg-gradient-to-br from-[#6f2eff] to-[#ad88ff] blur-sm" />
      </div>
    </div>
  );
}

function maskWallet(addr: string) {
  if (addr.length <= 10) return addr;
  return addr.slice(0, 4) + "…" + addr.slice(-4);
}
