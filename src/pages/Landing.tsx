import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Zap, Shield, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-illustration.jpg";
interface LandingProps {
  onNavigateToAuth: () => void;
}
export const Landing = ({
  onNavigateToAuth
}: LandingProps) => {
  const features = [{
    icon: <Zap className="h-6 w-6" />,
    title: "Automated Proposal Generation",
    description: "Generate professional proposals in minutes, not days, with AI-powered content creation."
  }, {
    icon: <Shield className="h-6 w-6" />,
    title: "Role-Based Access Control",
    description: "Secure dashboards tailored for customers, team managers, and team members."
  }, {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Performance Analytics",
    description: "Track proposal success rates and optimize your business development workflow."
  }];
  const benefits = ["Reduce proposal creation time by 80%", "Improve win rates with data-driven insights", "Streamline team collaboration", "Maintain consistent quality standards", "Scale your business development efforts"];
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">PitchForge</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onNavigateToAuth}>
              Sign In
            </Button>
            <Button onClick={onNavigateToAuth}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16 bg-gradient-to-br from-background to-pitchforge-light">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Automate Your
                  <span className="text-primary block">Business Proposals</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Transform your business development workflow with PitchForge's intelligent proposal automation platform. 
                  Create winning proposals faster, collaborate seamlessly, and scale your success.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={onNavigateToAuth} className="gap-2">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Watch Demo
                </Button>
              </div>

              <div className="space-y-3">
                {benefits.slice(0, 3).map((benefit, index) => <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>)}
              </div>
            </div>
            
            <div className="relative">
              <img src={heroImage} alt="Business proposal automation workflow" className="rounded-2xl shadow-2xl w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Powerful Features for Modern Teams
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to streamline your proposal process and accelerate business growth
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-16 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                Transform Your Business Development Process
              </h2>
              <p className="text-lg text-muted-foreground">
                Join thousands of companies that have revolutionized their proposal workflow with PitchForge's 
                intelligent automation platform.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-success" />
                    </div>
                    <span className="text-foreground font-medium">{benefit}</span>
                  </div>)}
              </div>
              
              <Button size="lg" onClick={onNavigateToAuth} className="gap-2">
                Get Started Today
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary">80%</div>
                    <div className="text-sm text-muted-foreground">Time Reduction</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary">95%</div>
                    <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6 mt-8">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary">50%</div>
                    <div className="text-sm text-muted-foreground">Higher Win Rate</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary">24/7</div>
                    <div className="text-sm text-muted-foreground">Support Available</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-primary">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground">
            Ready to Accelerate Your Business?
          </h2>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Join PitchForge today and experience the future of business proposal automation. 
            Start your free trial now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={onNavigateToAuth} className="gap-2">
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/20 bg-slate-50 text-sky-950">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <span className="text-lg font-bold text-foreground">PitchForge</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 PitchForge. All rights reserved. Empowering businesses through intelligent automation.
          </p>
        </div>
      </footer>
    </div>;
};