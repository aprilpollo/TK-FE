import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import useAuth from "@/auth/context/useJwtAuth";
import TokenManager from "@/auth/utils/tokenManager";
import Loading from "@/shared/Loading";

function Callback() {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleCallback = async () => {
    try {
      // Parse id_token from URL hash fragment
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const idToken = params.get("id_token");

      if (!idToken) {
        setError("No id_token found in callback URL");
        return;
      }

      // Get stored nonce and verify
      const storedNonce = TokenManager.getGoogleNonce();

      if (!storedNonce) {
        setError("No nonce found. Please try signing in again.");
        return;
      }

      // Clear nonce after retrieving
      TokenManager.clearGoogleNonce();

      // Call signInWithGoogle
      const response = await signInWithGoogle(idToken, storedNonce);

      if (response.ok) {
        // Redirect to dashboard on success
        navigate("/", { replace: true });
      } else {
        const data = await response.json();
        setError(data.message || "Failed to sign in with Google");
      }
    } catch (err) {
      console.error("Google callback error:", err);
      setError("An error occurred during sign in. Please try again.");
    }
  };

  useEffect(() => {
    handleCallback();
  }, [navigate, signInWithGoogle]);

  if (error) {
    toast.error(error);
    navigate("/auth/sign-in", { replace: true });
  }
  return <Loading />;
}

export default Callback;
