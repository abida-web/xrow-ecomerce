"use client";
import { useRouter } from "next/navigation";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { UsersRound, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const SignupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignUpForm = z.infer<typeof SignupSchema>;

const Signup = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(SignupSchema), // ← FIXED: Added resolver
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
      <div className="bg-orange-50 flex items-center justify-center">
        {/* Left side - can add image or content here */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-orange-500">Xrow</h2>
          <p className="text-gray-600 mt-2">Welcome back</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-20">
        <div className="w-full max-w-md">
          <span className="inline-block bg-orange-100 rounded-full p-2">
            <UsersRound className="w-12 h-12 text-orange-500" />
          </span>
          <h1 className="text-5xl font-semibold mt-5">Get Started</h1>
          <p className="py-6 text-xs text-gray-400">
            Welcome to Xrow - Let's get started
          </p>

          <form
            onSubmit={handleSubmit(handleSignUp)}
            className="border-t pt-5 border-gray-300"
          >
            <div className="flex flex-col">
              <label htmlFor="name" className="my-2 text-xs text-gray-400">
                Your name
              </label>
              <input
                {...register("name")}
                id="name"
                placeholder="Leo"
                disabled={isSubmitting}
                type="text"
                className="px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {errors.name && ( // ← FIXED: Changed from errors.email to errors.name
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-5 bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSubmitting ? "Creating account..." : "Sign Up"}{" "}
              {/* ← FIXED: Changed text */}
            </button>

            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{" "}
              {/* ← FIXED: Changed from "Don't have" to "Already have" */}
              <a
                href="/login" // ← FIXED: Changed from "/sign-up" to "/sign-in"
                className="text-orange-500 ml-1 hover:underline font-medium"
              >
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
