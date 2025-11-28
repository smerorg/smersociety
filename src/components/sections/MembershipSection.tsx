import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MembershipSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    institution: '',
    emailId: '',
    mobileNumber: '',
    scopusLink: '',
    orcidLink: '',
    googleScholarLink: '',
    country: '',
    agreeTerms: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.institution || !formData.emailId || !formData.mobileNumber || !formData.country || !formData.agreeTerms) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and accept the terms.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Send form data to PHP endpoint
      const response = await fetch('https://www.sme-res.org/api/send-membership.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message,
          variant: "default",
        });
        
        // Reset form
        setFormData({
          name: '',
          institution: '',
          emailId: '',
          mobileNumber: '',
          scopusLink: '',
          orcidLink: '',
          googleScholarLink: '',
          country: '',
          agreeTerms: false
        });
      } else {
        toast({
          title: "Error",
          description: data.error || 'Failed to submit application',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "An error occurred while submitting your application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const membershipTypes = [
    { id: 'student', label: 'Student Member', price: '₹1,500', description: 'For current students pursuing higher education' },
    { id: 'lifetime', label: 'Life Time Membership', price: '₹3,000', description: 'Full membership benefits for lifetime' },
    { id: 'fellow', label: 'Fellow Member Award', price: '₹5,000', description: 'Prestigious fellowship with FSMER designation' },
    { id: 'institutional', label: 'Institutional Membership', price: '₹50,000', description: 'For educational institutions and organizations' }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container-academic">
        <div className="text-center mb-12">
          <h1 className="heading-xl mb-4 text-primary">SMER Membership Application</h1>
          <p className="text-large text-muted-foreground max-w-3xl mx-auto">
            Join the Society for Modern English Research and become part of a prestigious community 
            of scholars, researchers, and educators dedicated to advancing English studies.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Application Form */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Membership Application Form</CardTitle>
                <CardDescription>
                  Please fill out all required information carefully. Fields marked with * are mandatory.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary border-b border-border pb-2">
                      Personal Information
                    </h3>
                    
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="institution">Institution *</Label>
                      <Input
                        id="institution"
                        value={formData.institution}
                        onChange={(e) => handleInputChange('institution', e.target.value)}
                        placeholder="Your institution/university"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="emailId">Email ID *</Label>
                      <Input
                        id="emailId"
                        type="email"
                        value={formData.emailId}
                        onChange={(e) => handleInputChange('emailId', e.target.value)}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="mobileNumber">Mobile/Telephone Number *</Label>
                      <Input
                        id="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                        placeholder="Your contact number"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        placeholder="Your country"
                        required
                      />
                    </div>
                  </div>

                  {/* Academic Links */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary border-b border-border pb-2">
                      Academic Profiles (Optional)
                    </h3>

                    <div>
                      <Label htmlFor="scopusLink">Scopus Link</Label>
                      <Input
                        id="scopusLink"
                        value={formData.scopusLink}
                        onChange={(e) => handleInputChange('scopusLink', e.target.value)}
                        placeholder="https://www.scopus.com/..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="orcidLink">ORCID Link</Label>
                      <Input
                        id="orcidLink"
                        value={formData.orcidLink}
                        onChange={(e) => handleInputChange('orcidLink', e.target.value)}
                        placeholder="https://orcid.org/..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="googleScholarLink">Google Scholar Link</Label>
                      <Input
                        id="googleScholarLink"
                        value={formData.googleScholarLink}
                        onChange={(e) => handleInputChange('googleScholarLink', e.target.value)}
                        placeholder="https://scholar.google.com/..."
                      />
                    </div>
                  </div>

                  {/* Declaration */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary border-b border-border pb-2">
                      Declaration
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agreeTerms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => handleInputChange('agreeTerms', checked as boolean)}
                        required
                      />
                      <Label htmlFor="agreeTerms" className="text-sm cursor-pointer">
                        I confirm that the declaration below is accurate.
                      </Label>
                    </div>

                    <div className="bg-accent/50 p-4 rounded-lg space-y-3">
                      <p className="text-sm text-muted-foreground">
                        I am confirming that the above information is correct and complete. I express my sincere
                        interest in becoming a member of SMER and fully support its mission to advance research,
                        knowledge exchange, and professional development.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        I look forward to contributing meaningfully to the activities and initiatives of SMER.
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 border-t border-border">
                    <Button type="submit" className="w-full" size="lg">
                      Submit Application
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      This will open your email client with the application details. 
                      Please send the email to complete your application.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MembershipSection;