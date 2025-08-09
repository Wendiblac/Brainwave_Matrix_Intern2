import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase"; // YOU FORGOT TO IMPORT THIS!
import { setDoc, doc } from "firebase/firestore";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !displayName || !confirmPassword) return;

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    setLoading(true);
    try {
      await signup(email, password, displayName);
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

const handleGoogleSignup = async () => {
  setLoading(true);
  try {
    const userCredential = await loginWithGoogle(); // your context function should return this
    const user = userCredential?.user;

    if (!user) throw new Error("Google Auth failed");

    // Write to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
    });

    navigate("/");
  } catch (error) {
    console.error("Google signup error:", error);
    alert("Google signup failed. Check console for details.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
        <div className="bg-gradient-primary p-2 rounded-xl flex items-center justify-center mb-4">
          <img
            src="/logo.png"
            alt="App Logo"
            loading="lazy"
            className="w-22 h-20"
          />
        </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Join the Chat
          </h1>
          <p className="text-muted-foreground">
            Create your account to start chatting
          </p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Fill in your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <div className="relative">
                  <img
                    src="/user.png"
                    alt="User"
                    loading="lazy"
                    className="absolute left-0 top-0 h-10 w-10 text-muted-foreground"
                  />
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Enter your display name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <img
                    src="/mail.png"
                    alt="Mail"
                    loading="lazy"
                    className="absolute left-0 top-0 h-10 w-11 text-muted-foreground"
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <img
                    src="/lock.png"
                    alt="Lock"
                    loading="lazy"
                    className="absolute left-0 top-0 h-11 w-11 text-muted-foreground"
                  />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <img
                    src="/lock.png"
                    alt="Lock"
                    loading="lazy"
                    className="absolute left-0 top-0 h-11 w-11 text-muted-foreground"
                  />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <Separator />

            <Button
              variant="outline"
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full flex items-center gap-2"
            >
              <img
                src="/google.png"
                alt="Google Logo"
                loading="lazy"
                className="w-10 h-10"
              />
              Continue with Google
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
