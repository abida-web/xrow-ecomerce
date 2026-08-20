"use client";
import { useRouter, useSearchParams } from "next/navigation";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { UsersRound, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const SignupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignUpForm = z.infer<typeof SignupSchema>;

const SignupContent = () => {
  const params = useSearchParams();
  const redirectParam = params.get("redirect");

  const getCleanRedirectPath = () => {
    if (!redirectParam) return "/";
    return redirectParam.startsWith("/") ? redirectParam : `/${redirectParam}`;
  };

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function handleSignUp(data: SignUpForm) {
    const targetDestination = getCleanRedirectPath();
    try {
      await authClient.signUp.email(
        { ...data, callbackURL: targetDestination },
        {
          onError: (error) => {
            toast.error("An error occurred");
          },
          onSuccess: () => {
            toast.success("Signed up successfully");
            router.push(targetDestination);
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
        <div className="text-center">
          <h2 className="text-4xl font-bold text-orange-500">Xrow</h2>
          <p className="text-gray-600 mt-2">Welcome back</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-20 bg-white">
        <div className="w-full max-w-md">
          <span className="inline-block bg-orange-100 rounded-full p-2">
            <UsersRound className="w-12 h-12 text-orange-500" />
          </span>
          <h1 className="text-5xl font-semibold mt-5 text-gray-800">
            Get Started
          </h1>
          <p className="py-6 text-xs text-gray-500">
            Welcome to Xrow - Let's get started
          </p>

          <form
            onSubmit={handleSubmit(handleSignUp)}
            className="border-t pt-5 border-gray-200"
          >
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="my-2 text-xs text-gray-500 font-medium"
              >
                Your name
              </label>
              <input
                {...register("name")}
                id="name"
                placeholder="Leo"
                disabled={isSubmitting}
                type="text"
                className="px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-800 placeholder-gray-400"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="my-2 text-xs text-gray-500 font-medium"
              >
                Your email
              </label>
              <input
                {...register("email")}
                id="email"
                placeholder="example@gmail.com"
                disabled={isSubmitting}
                type="email"
                className="px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-800 placeholder-gray-400"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="my-2 text-xs text-gray-500 font-medium"
              >
                Your password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  id="password"
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  type={showPassword ? "text" : "password"}
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12 text-gray-800 placeholder-gray-400"
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
              className="w-full mt-5 bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </button>

            <p className="mt-4 text-center text-sm text-gray-500">
              Already have an account?
              <a
                href="/login"
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

export default SignupContent;
