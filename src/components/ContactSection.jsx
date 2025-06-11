import {
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef } from "react";

export const ContactSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Get form data
    const formData = new FormData(formRef.current);
    const contactData = {
      name: formData.get('user_name'),
      email: formData.get('user_email'),
      message: formData.get('message')
    };

    // Basic client-side validation
    if (!contactData.name?.trim() || !contactData.email?.trim() || !contactData.message?.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Send to backend API (which now handles both database and EmailJS)
      const backend = import.meta.env.VITE_API_BACKEND_TYPE || 'node';

      let API_URL;

      if (backend === 'php') {
        API_URL = 'https://portfoliobackendphp-d4anezewcvfneaa2.eastus2-01.azurewebsites.net/api/contact';
      } else {
        API_URL = 'https://portfoliobackend-cbcjgweeaza9gubx.eastus2-01.azurewebsites.net/api/contact';
      }
      console.log('Sending to:', API_URL);
      console.log('Data:', contactData);
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData)
      });

      console.log('Response status:', response.status);

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let result;
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        // If not JSON, get text to see what we received
        const text = await response.text();
        console.log('Non-JSON response:', text);
        throw new Error(`Server returned ${response.status}: ${text.substring(0, 100)}...`);
      }

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}: ${result.message || 'Failed to send message'}`);
      }

      // Show success message
      const emailStatus = result.emailSent ? " Email notification sent!" : " (Email notification may have failed)";
      
      toast({
        title: "Message sent",
        description: `Thank you for your message. I'll get back to you soon! Sent using ${backend.toUpperCase()}.`,
      });
      
      // Reset the form
      formRef.current.reset();
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Handle different types of errors
      let errorMessage = "There was a problem sending your message. Please try again.";
      
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.message.includes('Too many')) {
        errorMessage = "Too many requests. Please wait a few minutes before trying again.";
      } else if (error.message.includes('404')) {
        errorMessage = "API endpoint not found. The server may be down or the route is incorrect.";
      } else if (error.message.includes('500')) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error sending message",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-4 relative bg-secondary/30">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Get In <span className="text-primary"> Touch</span>
        </h2>

        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Have a project in mind or want to collaborate? Feel free to reach out.
          I'm always open to discussing new opportunities.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold mb-6">
              Contact Information
            </h3>

            <div className="space-y-6 justify-center">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-left">Email</h4>
                  <a
                    href="mailto:alexmerlo23@gmail.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    alexmerlo23@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-left">Phone</h4>
                  <a
                    href="tel:+15617526111"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    +1 (561) 752-6111
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-left">Location</h4>
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Gainesville, FL
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <h4 className="font-medium mb-4">Connect With Me</h4>
              <div className="flex space-x-4 justify-center">
                <a href="https://www.linkedin.com/in/alexmerlo23" target="_blank" rel="noopener noreferrer">
                  <Linkedin />
                </a>
                <a href="https://www.instagram.com/alex_merlo23/" target="_blank" rel="noopener noreferrer">
                  <Instagram />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-card p-8 rounded-lg shadow-xs">
            <h3 className="text-2xl font-semibold mb-6">Send a Message</h3>

            <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="user_name"
                  className="block text-sm font-medium mb-2"
                >
                  Your Name *
                </label>
                <input
                  type="text"
                  id="user_name"
                  name="user_name"
                  required
                  maxLength="100"
                  className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary"
                  placeholder="Alexander Merlo"
                />
              </div>

              <div>
                <label
                  htmlFor="user_email"
                  className="block text-sm font-medium mb-2"
                >
                  Your Email *
                </label>
                <input
                  type="email"
                  id="user_email"
                  name="user_email"
                  required
                  maxLength="255"
                  className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary"
                  placeholder="alexmerlo23@gmail.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Your Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="4"
                  maxLength="4000"
                  className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Hello, I'd like to talk about..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "cosmic-button w-full flex items-center justify-center gap-2",
                  isSubmitting && "opacity-70 cursor-not-allowed"
                )}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};