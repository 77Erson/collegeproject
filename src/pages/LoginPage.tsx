
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Chrome } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();

  const onSubmit = async (data: LoginFormData) => {
    const { error } = await signIn(data.email, data.password);
    
    if (error) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Login successful",
        description: "You have been logged in successfully.",
      });
      
      navigate('/app');
    }
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Login to AttendAI</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  {...register('email', {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password', { required: "Password is required" })}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link to="/" className="font-medium text-brand-500 hover:text-brand-400">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Button type="submit" className="w-full bg-brand-500 hover:bg-brand-600">
                Sign in
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-50 px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={handleGoogleSignIn}
              >
                <Chrome className="mr-2 h-4 w-4" />
                Sign in with Google
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col">
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-brand-500 hover:text-brand-400">
                  Register
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>

      <Footer />
    </>
  );
};

export default LoginPage;
