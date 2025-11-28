import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    institution: '',
    subject: '',
    message: '',
    newsletter: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Create email content
    const emailContent = `
SMER Contact Form Submission

From: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Institution: ${formData.institution || 'Not specified'}
Subject: ${formData.subject}

Message:
${formData.message}

Newsletter Subscription: ${formData.newsletter ? 'Yes' : 'No'}
    `;

    // Create mailto link
    const subject = encodeURIComponent(`SMER Contact: ${formData.subject}`);
    const body = encodeURIComponent(emailContent);
    const mailtoLink = `mailto:smer@sme-res.org?subject=${subject}&body=${body}`;
    
    window.open(mailtoLink, '_blank');
    
    toast({
      title: "Message Prepared",
      description: "Your email client will open with your message. Please send the email to complete your inquiry.",
    });

    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      institution: '',
      subject: '',
      message: '',
      newsletter: false
    });
  };

  return (
    <section className="section-academic bg-muted/20">
      <div className="container-academic">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-heading-1 mb-6">Contact Us</h2>
          <p className="text-body-lg text-muted-foreground">
            Get in touch with our team for membership inquiries, conference information, 
            or general questions about SMER activities and research opportunities.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="card-academic p-8">
              <h3 className="text-heading-3 mb-6">Get in Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Address</h4>
                    <p className="text-muted-foreground">
                      Chennai-603202<br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Email</h4>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">
                        <a href="mailto:smer@sme-res.org" className="text-primary hover:underline">smer@sme-res.org</a>
                      </p>
                    </div>
                  </div>
                </div>


              </div>
            </div>

            {/* Quick Contact Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="card-academic p-6 text-center">
                <h4 className="font-semibold mb-2">Membership Services</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Questions about joining SMER or member benefits
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => window.open('mailto:smer@sme-res.org?subject=Membership Inquiry', '_blank')}
                >
                  Contact Membership
                </Button>
              </div>
              
              <div className="card-academic p-6 text-center">
                <h4 className="font-semibold mb-2">Event Inquiries</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Information about conferences and workshops
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => window.open('mailto:smer@sme-res.org?subject=Event Inquiry', '_blank')}
                >
                  Contact Events
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card-academic p-8">
            <h3 className="text-heading-3 mb-6">Send us a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Institution/Affiliation</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => handleInputChange('institution', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Your university or organization"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subject *</label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select a subject</option>
                  <option value="membership">Membership Inquiry</option>
                  <option value="conference">Conference Information</option>
                  <option value="publication">Publication Submission</option>
                  <option value="collaboration">Research Collaboration</option>
                  <option value="general">General Question</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message *</label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Please provide details about your inquiry..."
                ></textarea>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="newsletter"
                  checked={formData.newsletter}
                  onChange={(e) => handleInputChange('newsletter', e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="newsletter" className="text-sm text-muted-foreground">
                  I would like to receive updates about SMER events, publications, and news
                </label>
              </div>

              <Button type="submit" variant="membership" size="lg" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ContactSection;