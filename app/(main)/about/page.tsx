import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start">
      <section className="container px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <Badge className="mb-4">About Us</Badge>
          <h1 className="text-4xl font-bold mb-6">
            Simple, Effective Resume Creation & Career Guidance
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            We&apos;ve built a straightforward tool to help you create
            professional resumes quickly and easily, enhanced with AI-powered
            content suggestions. Plus, explore comprehensive career resources
            and opportunities to take your next big step.
          </p>

          <div className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
                <div className="grid gap-4">
                  <div className="flex gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">
                        ATS-Friendly Templates
                      </h3>
                      <p className="text-muted-foreground">
                        Our templates are designed to pass through Applicant
                        Tracking Systems while maintaining a professional
                        appearance.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">
                        AI-Enhanced Content
                      </h3>
                      <p className="text-muted-foreground">
                        Powered by Llama 3.1, get suggestions to improve your
                        resume content and make your experience stand out.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Simple Export</h3>
                      <p className="text-muted-foreground">
                        Download your completed resume as a PDF, ready to send
                        to employers.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">
                        Career Opportunities
                      </h3>
                      <p className="text-muted-foreground">
                        In addition to our resume creation tools, we provide
                        comprehensive career resources. Explore job openings and
                        learn about industry trends all in one place.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
