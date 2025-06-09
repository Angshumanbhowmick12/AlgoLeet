import React, { useState ,useEffect} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Code, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

import { z } from "zod";
import AuthImagePattern from "../components/AuthImagePattern";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "../components/ui/button";

const LoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be atleast of 6 characters"),
  
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {checkAuth,login,isLoggingIn}=useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema), 
  });

  const onSubmit = async (data) => {
    try {
      await login(data)
    } catch (error) {
      console.error("SignIn failed",error);
      
    }
  };


  
  

  return (
    <div className="h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center group-hover:bg-accent transition-colors">
                <Code className="w-6 h-6 text-amber-600" />
              </div>
              <h1 className="text-2xl font-bold mt-2">
                {" "}
                Welcome Back to <span>AlgoLeet</span>
              </h1>
              <p className="">Login to your account </p>
            </div>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            

            {/* email  */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className=" relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  {...register("email")}
                  className={`input input-bordered w-full pl-10 bg-accent ${
                    errors.email ? "input-error" : ""
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`input input-bordered w-full pl-10 bg-accent ${
                    errors.password ? "input-error" : ""
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button variant="outline"
              type="submit"
              className=" text-white bg-amber-600 w-full"
             disabled={isLoggingIn}
            >
               {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
          {/* Footer */}
          <div className="text-center">
            <p className="">
              Don't have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={"Sign in to continue your journey with us. Don't have an account? Create one now."}
      />
    </div>
  );
};

export default LoginPage;
