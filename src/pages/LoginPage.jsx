import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          if (email === "admin@example.com" && password === "admin123") {
            resolve({
              success: true,
              user: {
                id: 1,
                name: "Admin User",
                email: "admin@example.com",
                role: "admin"
              }
            });
          } else if (email === "user@example.com" && password === "user123") {
            resolve({
              success: true,
              user: {
                id: 2,
                name: "Regular User",
                email: "user@example.com",
                role: "user"
              }
            });
          } else {
            resolve({ success: false });
          }
        }, 1000);
      });
      
      if (response.success && response.user) {
        setUser(response.user);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${response.user.name}!`,
        });
        if (response.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "An error occurred during login. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md py-12">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="your@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs text-eco hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-eco hover:bg-eco-dark" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-center text-muted-foreground mt-2">
            Don't have an account?{" "}
            <Link to="/register" className="text-eco hover:underline">
              Sign up
            </Link>
          </div>
          <div className="text-sm text-center text-muted-foreground mt-2">
            <div className="text-xs text-muted-foreground">
              Demo credentials:
            </div>
            <div className="text-xs">
              Admin: admin@example.com / admin123
            </div>
            <div className="text-xs">
              User: user@example.com / user123
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;