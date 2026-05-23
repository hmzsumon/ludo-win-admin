import ForgotPasswordForm from "@/components/reagiter-login/ForgetPassForm";

const ForgotPasswordPage = () => {
  return (
    <section className="mx-auto max-w-xl px-2 py-8">
      <div className="rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_10px_50px_-20px_rgba(0,0,0,0.6)]">
        <ForgotPasswordForm />
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
