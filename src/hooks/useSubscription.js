import { useState } from "react";
import { submitSubscriber } from "@/utils/api";

export const useSubscription = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await submitSubscriber({ email });
      setMessage("Subscribed successfully! Check your email.");
      setEmail("");
    } catch (err) {
      setMessage("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, loading, message, handleSubscribe };
};
