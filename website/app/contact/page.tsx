import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Mail, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact - AI Demo Site',
  description: 'Get in touch with Christian Zanchetta for inquiries and AI solutions.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Contact Me</h1>
            <p className="text-xl text-muted-foreground">
              Get in touch for inquiries or AI solutions
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* LinkedIn Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                     <svg xmlns="http://www.w3.org/2000/svg" className="text-blue-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                  </div>
                  <div>
                    <CardTitle>LinkedIn</CardTitle>
                    <CardDescription>Professional Network</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Connect with me on LinkedIn for professional opportunities and networking.
                </p>
                <Button asChild variant="outline" className=" w-full">
                  <a
                    href="https://www.linkedin.com/in/christian-zanchetta-a7140621/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="text-blue-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                    Visit LinkedIn Profile
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Website Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <Globe className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle>Website</CardTitle>
                    <CardDescription>Personal Portfolio</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Visit my personal website to learn more about my work and projects.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <a
                    href="https://www.fiscet.it"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Globe className="h-4 w-4 text-green-600" />
                    Visit Website
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                About This Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This AI-powered apartment rental platform demonstrates <b>modern</b> web development with<br />
                <u>Next.js</u>, <u>TypeScript</u>, and <b className='text-red-600'>AI</b> integration.<br />
                Built with a focus on user experience and intelligent search capabilities.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
