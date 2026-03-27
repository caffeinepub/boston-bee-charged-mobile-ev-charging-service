import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { Battery, Clock, MapPin, Shield, Smartphone, Zap } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Fast Charging",
    description:
      "Quick and efficient mobile charging service for all EV models",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description: "Book appointments at your convenience, 7 days a week",
  },
  {
    icon: MapPin,
    title: "We Come to You",
    description: "Charge your EV at home, work, or anywhere in the Boston area",
  },
  {
    icon: Shield,
    title: "Safe & Reliable",
    description:
      "Professional service with certified equipment and trained technicians",
  },
  {
    icon: Battery,
    title: "All EV Models",
    description: "Compatible with all electric vehicle makes and models",
  },
  {
    icon: Smartphone,
    title: "Easy Booking",
    description: "Simple online scheduling with instant confirmation",
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Book Online",
    description:
      "Schedule your charging appointment through our easy-to-use booking system",
  },
  {
    step: "2",
    title: "We Come to You",
    description:
      "Our mobile charging unit arrives at your specified location at the scheduled time",
  },
  {
    step: "3",
    title: "Get Charged",
    description: "Relax while we charge your vehicle safely and efficiently",
  },
];

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 md:py-32">
        <div className="container relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Mobile EV Charging
                  <span className="block text-primary">Delivered to You</span>
                </h1>
                <p className="text-lg text-muted-foreground md:text-xl">
                  Boston's premier mobile electric vehicle charging service. We
                  bring the power to your location, so you can stay charged and
                  ready to go.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  onClick={() => navigate({ to: "/schedule" })}
                  className="text-base"
                >
                  Schedule Charging
                </Button>
                <Button size="lg" variant="outline" className="text-base">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img
                src="/assets/generated/boston-bee-realistic.dim_400x400.png"
                alt="Boston Bee Charged Logo"
                className="h-auto w-full max-w-md rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Why Choose Boston Bee Charged?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              We make EV charging convenient, reliable, and hassle-free with our
              mobile charging service.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="border-2 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted/30 py-20 md:py-32">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Getting your EV charged is as easy as 1-2-3
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {howItWorks.map((item) => (
              <div
                key={item.step}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold sm:text-4xl">
                Ready to Get Charged?
              </CardTitle>
              <CardDescription className="text-lg">
                Book your mobile EV charging appointment today and experience
                the convenience of on-demand charging.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button
                size="lg"
                onClick={() => navigate({ to: "/schedule" })}
                className="text-base"
              >
                Schedule Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
