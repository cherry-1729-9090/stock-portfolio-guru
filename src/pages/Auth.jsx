import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loginUser, registerUser } from "@/API/UserAPI";
import { useToast } from "@/components/ui/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await loginUser(formData);
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
      } else {
        await registerUser(formData);
        toast({
          title: "Success",
          description: "Account created successfully",
        });
      }
      navigate("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <Card className="w-[380px] shadow-xl transform -translate-y-8">
        <CardHeader className="space-y-3 pb-6">
          <div className="w-16 h-16 mx-auto bg-blue-500 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {isLogin ? "Welcome Back!" : "Create Account"}
          </CardTitle>
          <p className="text-center text-muted-foreground text-sm">
            {isLogin
              ? "Enter your credentials to access your account"
              : "Sign up to get started with your journey"}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className="pl-10 py-6"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  className="pl-10 py-6"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full py-6 text-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold"
            >
              {isLogin ? "Login" : "Sign Up"}
            </Button>

            {isLogin && (
              <div className="text-center">
                <a href="#" className="text-sm text-blue-500 hover:underline">
                  Forgot your password?
                </a>
              </div>
            )}

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full text-sm text-blue-500 hover:text-blue-600 transition-colors"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Login"}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
