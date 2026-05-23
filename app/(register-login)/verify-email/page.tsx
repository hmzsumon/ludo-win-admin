import VerifyEmailForm from "@/components/reagiter-login/VerifyEmailForm";

const VerifyMailPage = () => {
  return (
    <section className="mx-auto max-w-xl px-4 py-10">
      <h1 className="mb-6 text-center text-3xl font-extrabold tracking-tight text-[rgb(var(--app-text))]">
        Verify your email
      </h1>

      <div className="rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_10px_50px_-20px_rgba(0,0,0,0.6)]">
        <VerifyEmailForm />
      </div>
    </section>
  );
};

export default VerifyMailPage;
