import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AuthSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

interface AuthFormProps extends React.ComponentPropsWithoutRef<"div"> {
  type: "login" | "register";
}

export function AuthForm({ type, className, ...props }: AuthFormProps) {
  const token = localStorage.getItem("token");
  if (token) {
    window.location.href = "/dashboard";
  }

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(AuthSchema),
  });

  const isLogin = type === "login";
  const title = isLogin ? "Login" : "Register";
  const description = isLogin
    ? "Enter your email below to login"
    : "Create a new account below";
  const endpoint = isLogin ? "/auth/login" : "/auth/register";

  const onSubmit = async (data: z.infer<typeof AuthSchema>) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await axios.post(endpoint, data);
      setIsLoading(false);
      setSuccess(`${title} successful!`);

      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setIsLoading(false);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register("email")}
                  id="email"
                  placeholder="m@example.com"
                />
                {errors.email && (
                  <p className="text-destructive capitalize text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {isLogin && (
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  )}
                </div>
                <Input
                  {...register("password")}
                  id="password"
                  type="password"
                />
                {errors.password && (
                  <p className="text-destructive text-sm capitalize">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="h-1">
                {error && <p className="text-destructive  text-sm ">{error}</p>}
                {success && (
                  <p className="text-green-500 text-sm ">{success}</p>
                )}
              </div>

              <Button type="submit" className="w-full">
                {isLoading ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  title
                )}
              </Button>
            </div>

            <div className="mt-4 text-center text-sm">
              {isLogin ? (
                <>
                  Don&apos;t have an account?{" "}
                  <a href="/register" className="underline underline-offset-4">
                    Sign up
                  </a>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <a href="/login" className="underline underline-offset-4">
                    Log in
                  </a>
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
