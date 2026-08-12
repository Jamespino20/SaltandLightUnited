import { Users, Clock, User, CheckCircle } from "@phosphor-icons/react";

const groups = [
  {
    id: "1",
    name: "Teens for Christ",
    description:
      "For teens ages 13–17. A space to explore faith, ask questions, and grow together through Bible study, worship, and fellowship.",
    schedule: "Saturdays, 3:00 PM",
    leader: "Kuya Josh Dela Cruz",
  },
  {
    id: "2",
    name: "Tweens of Light",
    description:
      "For tweens ages 10–12. Building a strong foundation of faith through fun, interactive Bible lessons and activities.",
    schedule: "Saturdays, 1:00 PM",
    leader: "Sis. Rachel Tan",
  },
  {
    id: "3",
    name: "Worship Team",
    description:
      "For those passionate about worship and music. Learn to lead praise, play instruments, and serve through song.",
    schedule: "Fridays, 5:00 PM",
    leader: "Sis. Anna Reyes",
  },
  {
    id: "4",
    name: "Prayer Warriors",
    description:
      "A dedicated prayer group interceding for our school, families, nation, and the nations.",
    schedule: "Wednesdays, 6:00 PM",
    leader: "Bro. Michael Santos",
  },
];

const steps = [
  {
    number: "1",
    title: "Show Up",
    description: "Come to any of our weekly gatherings. No registration needed.",
  },
  {
    number: "2",
    title: "Connect",
    description:
      "Meet the leaders and members. We'll help you find the group that fits your age and interests.",
  },
  {
    number: "3",
    title: "Join In",
    description:
      "Start attending your group regularly. Growth happens in consistency.",
  },
];

export default function GroupsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slu-blue">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
              Our Groups
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Find your community. Grow in faith. Serve together.
            </p>
          </div>
        </div>
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-slu-blue-dark/30 blur-3xl" />
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-slu-blue-light/20 blur-3xl" />
      </section>

      {/* Group Cards */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2">
            {groups.map((group) => (
              <div
                key={group.id}
                className="rounded-2xl border border-slu-gray-200 bg-slu-offwhite p-6 transition-all hover:shadow-md"
              >
                <h3 className="text-xl font-bold text-slu-black">
                  {group.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slu-gray-600">
                  {group.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-slu-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-slu-blue" />
                    {group.schedule}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User size={14} className="text-slu-blue" />
                    {group.leader}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Join */}
      <section className="bg-slu-offwhite py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slu-blue/10 text-slu-blue">
              <Users size={24} />
            </div>
            <h2 className="text-3xl font-bold text-slu-black sm:text-4xl">
              How to Join
            </h2>
            <p className="mt-2 text-slu-gray-500">
              Getting involved is simple — here&apos;s how
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-slu-gray-200 bg-white p-6 text-center"
              >
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slu-blue text-sm font-bold text-white">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-slu-black">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-slu-gray-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <p className="flex items-center justify-center gap-2 text-sm text-slu-gray-500">
              <CheckCircle size={16} className="text-slu-blue" />
              No sign-up required — just show up and belong.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
