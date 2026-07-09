"use client";
import { useRouter } from "next/navigation";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
const SignupSchema = z.object({
  name: z.string().min(3, "Namw must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type SignUpForm = z.infer<typeof SignupSchema>;
const Signup = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  async function handleSignUp(data: SignUpForm) {
    try {
      await authClient.signUp.email(
        { ...data, callbackURL: "/" },
        {
          onError: (error) => {
            console.log(error);
          },
          onSuccess: () => {
            (router.push("/"), router.refresh());
          },
        },
      );
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-center">Create your account</h1>
        <form onSubmit={handleSubmit(handleSignUp)}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              {...register("name")}
              id="name"
              placeholder="Leo"
              disabled={isSubmitting}
              type="text"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              {...register("email")}
              id="email"
              placeholder="you@example.com"
              disabled={isSubmitting}
              type="email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              {...register("password")}
              id="password"
              placeholder="••••••"
              disabled={isSubmitting}
              type="password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#06102c] text-white py-2 px-4 rounded-md hover:bg-[#14224c] transition-colors focus:outline-none focus:ring-2 focus:ring-[#06102c] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?
            <a
              href="/sign-up"
              className="text-[#06102c] hover:underline font-medium"
            >
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
