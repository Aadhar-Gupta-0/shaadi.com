import { useState } from "react";
import { Send, Mail, Phone, MessageSquare, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const faqs = [
  {
    question: "How does the college matching algorithm work?",
    answer: "Our AI-powered algorithm analyzes your academic profile, preferences, standardized test scores, and career goals to identify colleges where you have the best chances of admission and success. We consider factors like acceptance rates, program offerings, location preferences, and budget constraints to provide personalized recommendations."
  },
  {
    question: "What do Safe, Target, and Reach categories mean?",
    answer: "Safe colleges are institutions where your profile exceeds the average admitted student, giving you a high probability of acceptance (typically 70%+). Target colleges are schools where your credentials match their typical admits (40-70% probability). Reach colleges are selective institutions where admission is competitive, but still possible with strong application materials (below 40% probability)."
  },
  {
    question: "How can I improve my match percentage?",
    answer: "You can improve your match scores by: 1) Enhancing your academic profile (grades, test scores), 2) Developing relevant extracurricular activities, 3) Gaining meaningful work or volunteer experience, 4) Crafting compelling essays and personal statements, 5) Obtaining strong letters of recommendation. Our platform tracks your progress and provides actionable insights."
  },
  {
    question: "Can I apply to colleges directly through this platform?",
    answer: "Currently, our platform helps you research, compare, and organize your college applications. We provide direct links to official application portals and track your deadlines. In the future, we plan to integrate with Common App and other application systems for seamless submissions."
  },
  {
    question: "How often is the college data updated?",
    answer: "We update our college database quarterly with the latest admission statistics, tuition rates, program offerings, and scholarship information. We source data from official college websites, government databases, and verified third-party providers to ensure accuracy."
  },
  {
    question: "What should I do if I need personalized counseling?",
    answer: "Click the 'Request Counseling' button to schedule a one-on-one session with our experienced education counselors. They can help with application strategy, essay review, interview preparation, and financial aid guidance. Initial consultations are complimentary for active users."
  },
];

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

export const Help = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your College Admissions Assistant. How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputMessage("");

    // Simulate assistant response
    setTimeout(() => {
      const responses = [
        "That's a great question! Based on your profile, I'd recommend focusing on...",
        "I can help you with that. Let me provide some guidance...",
        "Here's what I suggest: First, make sure to...",
        "Great point! Many students wonder about this. The key is to...",
      ];
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  return (
    <section id="help" className="min-h-screen py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Help & Support</h2>
          <p className="text-xl text-muted-foreground">We're here to guide you every step of the way</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* FAQ Section */}
          <div className="bg-card rounded-2xl p-8 shadow-strong">
            <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Chat Assistant */}
          <div className="bg-card rounded-2xl shadow-strong flex flex-col h-[600px]">
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Chat Assistant</h3>
                  <p className="text-sm text-muted-foreground">Online now</p>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-6 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Typical response time: under 2 minutes
              </p>
            </div>
          </div>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 text-center hover:shadow-medium transition-shadow cursor-pointer">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Request Counseling</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Schedule a session with our expert counselors
            </p>
            <Button variant="outline" className="w-full">
              Book Appointment
            </Button>
          </Card>

          <Card className="p-6 text-center hover:shadow-medium transition-shadow cursor-pointer">
            <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-7 w-7 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Email Support</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get help via email within 24 hours
            </p>
            <Button variant="outline" className="w-full">
              Send Email
            </Button>
          </Card>

          <Card className="p-6 text-center hover:shadow-medium transition-shadow cursor-pointer">
            <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-7 w-7 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Phone Support</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Speak with us directly for urgent queries
            </p>
            <Button variant="outline" className="w-full">
              Call Now
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};
