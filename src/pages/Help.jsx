import { useState } from "react";
import {
  LifeBuoy,
  MessageCircle,
  BookOpen,
  PhoneCall,
  Mail,
  ChevronDown,
  ShieldAlert,
  Send,
} from "lucide-react";

const faqs = [
  {
    question: "How is a worker's risk score calculated?",
    answer:
      "SafeMine AI combines live gas levels, temperature, motion patterns, battery status, and signal strength from each worker's smart helmet into a single 0-100 risk score, updated in real time.",
  },
  {
    question: "What should I do when a critical alert is triggered?",
    answer:
      "Open the Alerts panel to see the affected worker and zone, then use the Evacuation view to trigger the nearest evacuation route. Critical alerts also page the on-duty safety manager automatically.",
  },
  {
    question: "Why does a zone show as high-risk with no active alerts?",
    answer:
      "Zone risk reflects trailing sensor trends (e.g. rising gas or temperature) even before a threshold breach fires an alert. Check Analytics for the underlying trend that raised the score.",
  },
  {
    question: "How often do sensors and smart helmets report data?",
    answer:
      "Helmets report over the LoRa network every few seconds under normal conditions and switch to a faster reporting interval automatically once a worker enters an elevated-risk state.",
  },
  {
    question: "Who can I contact for a helmet or sensor malfunction?",
    answer:
      "Log the fault under Smart Helmets or Sensors, then reach the hardware team via the emergency line below or through the Maintenance page to schedule a technician.",
  },
];

function Help() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="mx-auto max-w-[1400px] space-y-5">

      {/* HEADER */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
          Support
        </p>

        <h1 className="mt-1 text-2xl font-bold text-white">
          Help &amp; Support
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          Answers, documentation, and direct lines to the SafeMine support team.
        </p>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <QuickAction
          icon={BookOpen}
          color="cyan"
          title="Documentation"
          description="Guides for dashboards, sensors and alerts"
        />

        <QuickAction
          icon={MessageCircle}
          color="emerald"
          title="Live Chat"
          description="Chat with the SafeMine support team"
        />

        <QuickAction
          icon={Mail}
          color="violet"
          title="Email Support"
          description="support@safemine.ai"
        />

        <QuickAction
          icon={PhoneCall}
          color="amber"
          title="Call Operations"
          description="+1 (800) 555-0142"
        />

      </div>

      {/* EMERGENCY BANNER */}
      <div className="flex flex-col gap-3 rounded-2xl border border-red-400/15 bg-red-400/[0.03] p-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-400/10">
            <ShieldAlert size={20} className="text-red-400" />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-red-400">
              Life-threatening emergency
            </p>

            <p className="mt-1 text-xs text-slate-300">
              For an active incident, use the Evacuation panel first, then call the 24/7 emergency line.
            </p>
          </div>
        </div>

        <a
          href="tel:+18005551199"
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-red-400"
        >
          <PhoneCall size={14} />
          +1 (800) 555-1199
        </a>

      </div>

      {/* FAQ + CONTACT FORM */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">

        {/* FAQ */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
              <LifeBuoy size={18} className="text-cyan-400" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">
                Frequently Asked Questions
              </h2>

              <p className="text-[10px] text-slate-600">
                Common questions about monitoring and alerts
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={faq.question}
                  className="rounded-xl border border-white/[0.05] bg-white/[0.015]"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-3 p-4 text-left"
                  >
                    <span className="text-xs font-medium text-white">
                      {faq.question}
                    </span>

                    <ChevronDown
                      size={15}
                      className={`shrink-0 text-slate-500 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <p className="px-4 pb-4 text-[11px] leading-relaxed text-slate-500">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* CONTACT FORM */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">
              <Send size={18} className="text-emerald-400" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">
                Send a Message
              </h2>

              <p className="text-[10px] text-slate-600">
                We typically reply within one business day
              </p>
            </div>
          </div>

          <form
            onSubmit={(event) => event.preventDefault()}
            className="mt-5 space-y-4"
          >
            <div>
              <label className="text-[9px] font-medium uppercase tracking-wider text-slate-600">
                Subject
              </label>

              <input
                type="text"
                placeholder="Sensor calibration question"
                className="mt-2 h-10 w-full rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/30"
              />
            </div>

            <div>
              <label className="text-[9px] font-medium uppercase tracking-wider text-slate-600">
                Message
              </label>

              <textarea
                rows={5}
                placeholder="Describe the issue you're seeing..."
                className="mt-2 w-full resize-none rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/30"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-[#061018] transition hover:bg-emerald-400"
            >
              <Send size={14} />
              Send Message
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}

const colorClasses = {
  cyan: "bg-cyan-400/10 text-cyan-400",
  emerald: "bg-emerald-400/10 text-emerald-400",
  violet: "bg-violet-400/10 text-violet-400",
  amber: "bg-amber-400/10 text-amber-400",
};

function QuickAction({ icon: Icon, color, title, description }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0c121c] p-5 transition hover:border-white/[0.1]">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorClasses[color]}`}
      >
        <Icon size={18} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-white">
        {title}
      </h3>

      <p className="mt-1 text-[10px] text-slate-600">
        {description}
      </p>
    </div>
  );
}

export default Help;
