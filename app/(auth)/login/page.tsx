"use client";
import { useRouter } from "next/navigation";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { UsersRound, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInForm = z.infer<typeof LoginSchema>;

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(LoginSchema), // ← FIXED: Added resolver
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
            router.push("/"); // ← FIXED: Removed parentheses
            router.refresh();
          },
        },
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="grid grid-cols-2 min-h-screen">
      {/* Left side */}
      <div className="bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-orange-500">Xrow</h2>
          <p className="text-gray-600 mt-2">Welcome back</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex items-center justify-center px-20">
        <div className="w-full max-w-md">
          <span className="inline-block bg-orange-100 rounded-full p-2">
            <UsersRound className="w-12 h-12 text-orange-500" />
          </span>
          <h1 className="text-4xl font-semibold mt-5">Welcome Back</h1>
          <p className="py-6 text-xs text-gray-400">
            Log in to your Xrow account
          </p>

          <form
            onSubmit={handleSubmit(handleLogIn)}
            className="border-t pt-5 border-gray-300"
          >
            {/* Email */}
            <div className="flex flex-col">
              <label htmlFor="email" className="my-2 text-xs text-gray-400">
                Your email
              </label>
              <input
                {...register("email")}
                id="email"
                placeholder="example@gmail.com"
                disabled={isSubmitting}
                type="email"
                className="px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label htmlFor="password" className="my-2 text-xs text-gray-400">
                Your password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  id="password"
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  type={showPassword ? "text" : "password"}
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right mt-2">
              <a
                href="/forgot-password"
                className="text-xs text-orange-500 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-5 bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>

            {/* Footer */}
            <p className="mt-4 text-center text-sm text-gray-600">
              Don't have an account?
              <a
                href="/sign-up"
                className="text-orange-500 ml-1 hover:underline font-medium"
              >
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
