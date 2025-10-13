"use client";
import React, { useMemo, useState } from "react";

// MushRush — Early Access (Next.js + Tailwind)
export default function Page() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [wallet, setWallet] = useState<string | null>(null);
  const [referralInput, setReferralInput] = useState("");
  const [myReferral, setMyReferral] = useState("RF-XXXX");
  const maskedWallet = useMemo(() => (wallet ? maskWallet(wallet) : "0x…hidden"), [wallet]);

  const [joinedDiscord, setJoinedDiscord] = useState(false);
  const [sharedCard, setSharedCard] = useState(false);
  const [followedX, setFollowedX] = useState(false);
  const completed = [joinedDiscord, sharedCard, followedX].filter(Boolean).length;

  const canRegister = isSignedIn && referralInput.trim().length > 0 && completed === 3;

  function handleSignInWithX() {
    setIsSignedIn(true);
    setWallet("0x9aC3...eF19");
  }

  function handleCopyRef() {
    navigator.clipboard.writeText(myReferral);
    alert("Referral copied!");
  }

  function applyReferral() {
    alert(`Applied referral: ${referralInput}`);
  }

  function register() {
    alert("Registered for Early Access!");
  }

  function shareOnX() {
    const text = encodeURIComponent(
      `I'm joining MushRush Early Access! Use my referral ${myReferral} to climb the queue.`
    );
    const url = encodeURIComponent("https://your-domain.com/early-access");
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  }

  return (
    <div className="min-h-screen w-full bg-[#0b0a12] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#7b3cff] grid place-items-center font-bold">M</div>
            <div>
              <div className="text-lg font-semibold">MushRush — Early Access</div>
              <div className="text-sm text-white/60">Marketing landing • Share to climb the queue</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSignInWithX}
              className="rounded-xl bg-white px-4 py-2 text-black hover:bg-white/90"
            >
              {isSignedIn ? "Signed in" : "Sign in with X"}
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
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#c59cff]">GET EARLY ACCESS</h1>
            <p className="mt-3 max-w-prose text-white/70">
              Complete a few simple tasks and share your referral to move up the early access queue.
            </p>

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
                Your referral: <span className="font-semibold text-[#c7a6ff]">{myReferral}</span> {maskedWallet}
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <TaskRow label="Join our Discord" done={joinedDiscord} onAction={() => setJoinedDiscord(true)} actionLabel="Join" link="https://discord.gg/your-server" />
              <TaskRow label="Share your referral card" done={sharedCard} onAction={() => { setSharedCard(true); shareOnX(); }} actionLabel="Share" />
              <TaskRow label="Follow us on X" done={followedX} onAction={() => { setFollowedX(true); window.open('https://x.com/your-handle', '_blank'); }} actionLabel="Follow" />
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-white/60">{completed} / 3 tasks completed</div>
              <button
                disabled={!canRegister}
                onClick={register}
                className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                  canRegister ? "bg-[#7b3cff] hover:bg-[#6c34e0]" : "bg-white/10 text-white/40 cursor-not-allowed"
                }`}
              >
                Register for Early Access
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskRow({ label, done, onAction, actionLabel, link }: { label: string; done: boolean; onAction: () => void; actionLabel: string; link?: string; }) {
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
// comment
function maskWallet(addr: string) {
  if (addr.length <= 10) return addr;
  return addr.slice(0, 4) + "…" + addr.slice(-4);
}
