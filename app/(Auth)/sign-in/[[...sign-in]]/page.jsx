import { SignIn } from "@clerk/nextjs"

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn
        fallbackRedirectUrl="/dashboard"
        signUpFallbackRedirectUrl="/dashboard"
        appearance={{
          elements: {
            card: "rounded-2xl shadow-xl",
          },
        }}
      />
    </div>
  )
}

