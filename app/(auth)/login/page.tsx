"use client";
import { useRouter } from "next/navigation";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type SignInForm = z.infer<typeof LoginSchema>;
const Login = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function handleLogIn(data: SignInForm) {
    try {
      await authClient.signIn.email(
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
        <h1 className="text-2xl font-bold text-center">
          Log In to your account
        </h1>
        <p className="mb-8 text-sm text-gray-500 text-center">
          Welcome back! Please enter your details
        </p>
        <form onSubmit={handleSubmit(handleLogIn)}>
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

export default Login;
