
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, BarChart3, Users, Settings, Database, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AdministratorLanding = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Shield,
      title: "Advanced Security",
      description: "Enterprise-grade security with comprehensive audit trails, access controls, and threat monitoring."
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Real-time insights into platform usage, user engagement, and business performance metrics."
    },
    {
      icon: Users,
      title: "User Management",
      description: "Complete user lifecycle management with role-based access, bulk operations, and automated workflows."
    },
    {
      icon: Settings,
      title: "System Configuration",
      description: "Flexible platform settings, white-label options, and integration management tools."
    },
    {
      icon: Database,
      title: "Data Management",
      description: "Comprehensive data backup, migration tools, and compliance reporting capabilities."
    },
    {
      icon: Lock,
      title: "Compliance Ready",
      description: "Built-in GDPR, FERPA, and SOC 2 compliance with automated reporting and audit support."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="relative pt-14 sm:pt-16 lg:pt-18">
        {/* Hero Section */}
        <section className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-gentle-bounce"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10 space-y-8">
            <div className="space-y-6 max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                <span className="block text-foreground">Enterprise Learning</span>
                <span className="block bg-gradient-to-r from-secondary to-accent text-transparent bg-clip-text">Administration</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Powerful administrative tools for managing large-scale educational platforms. 
                Complete control, security, and insights for educational institutions and enterprises.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                <Link to="/auth">
                  <Button className="btn-primary text-lg px-8 py-4 h-auto rounded-xl group shadow-lg">
                    <span>Access Admin Portal</span>
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/security">
                  <Button variant="outline" className="text-lg px-8 py-4 h-auto rounded-xl border-border hover:bg-muted">
                    Security Dashboard
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto pt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">99.9%</div>
                <div className="text-muted-foreground">Uptime SLA</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">10M+</div>
                <div className="text-muted-foreground">Users Managed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">SOC 2</div>
                <div className="text-muted-foreground">Certified</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">24/7</div>
                <div className="text-muted-foreground">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Enterprise-Grade Administration
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive tools for managing large-scale educational platforms with security and compliance built-in.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <div key={index} className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security & Compliance Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-br from-secondary/10 to-accent/10 rounded-3xl p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    Security & Compliance First
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Built from the ground up with enterprise security standards. 
                    Meet regulatory requirements with automated compliance reporting and audit trails.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      <span className="text-foreground">SOC 2 Type II Certified</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span className="text-foreground">GDPR & FERPA Compliant</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-foreground">End-to-end Encryption</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      <span className="text-foreground">Real-time Threat Monitoring</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-card rounded-xl p-6 text-center border border-border">
                    <div className="text-2xl font-bold text-secondary mb-2">256-bit</div>
                    <div className="text-sm text-muted-foreground">Encryption</div>
                  </div>
                  <div className="bg-card rounded-xl p-6 text-center border border-border">
                    <div className="text-2xl font-bold text-accent mb-2">99.9%</div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                  </div>
                  <div className="bg-card rounded-xl p-6 text-center border border-border">
                    <div className="text-2xl font-bold text-primary mb-2">ISO 27001</div>
                    <div className="text-sm text-muted-foreground">Certified</div>
                  </div>
                  <div className="bg-card rounded-xl p-6 text-center border border-border">
                    <div className="text-2xl font-bold text-secondary mb-2">Multi-MFA</div>
                    <div className="text-sm text-muted-foreground">Security</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Integration Section */}
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Seamless Integration
                </h2>
                <p className="text-lg text-muted-foreground">
                  Connect with your existing systems and workflows through our comprehensive API and pre-built integrations.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="text-sm font-medium text-foreground">SSO/SAML</div>
                </div>
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="text-sm font-medium text-foreground">LMS Integration</div>
                </div>
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="text-sm font-medium text-foreground">REST API</div>
                </div>
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="text-sm font-medium text-foreground">Webhooks</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-secondary/5 to-accent/5">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Ready for Enterprise-Grade Education?
              </h2>
              <p className="text-lg text-muted-foreground">
                Join leading educational institutions and enterprises who trust our platform for their learning initiatives.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/auth">
                  <Button className="btn-primary text-lg px-10 py-4 h-auto rounded-xl shadow-lg">
                    Request Demo
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" className="text-lg px-10 py-4 h-auto rounded-xl border-border hover:bg-muted">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdministratorLanding;
