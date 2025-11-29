import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { countryDialCodes, CountryDialOption } from '@/data/countryDialCodes';

interface EventFormState {
  fullName: string;
  email: string;
  institution: string;
  country: string;
  phoneNumber: string;
  eventTitle: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  eventDescription: string;
  eventObjectives: string;
  targetAudience: string;
}

const eventTypeOptions = [
  'Conference',
  'Workshop',
  'Seminar',
  'Lecture',
  'Award or Achievement',
  'FDP',
  'Other'
];

const defaultState: EventFormState = {
  fullName: '',
  email: '',
  institution: '',
  country: 'India',
  phoneNumber: '',
  eventTitle: '',
  eventType: 'Conference',
  eventDate: '',
  eventLocation: '',
  eventDescription: '',
  eventObjectives: '',
  targetAudience: ''
};

const EventSubmissionForm = () => {
  const { toast } = useToast();
  const [formState, setFormState] = useState<EventFormState>(defaultState);
  const [selectedCountry, setSelectedCountry] = useState<CountryDialOption>(countryDialCodes[0]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof EventFormState, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleCountryChange = (countryName: string) => {
    const country = countryDialCodes.find(option => option.name === countryName);
    if (country) {
      setSelectedCountry(country);
      handleInputChange('country', country.name);
    } else {
      handleInputChange('country', countryName);
    }
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) {
      setPhotos([]);
      return;
    }

    const selected = Array.from(files).slice(0, 3);
    if (selected.length < 3) {
      toast({
        title: 'Photos required',
        description: 'Please select three clear event images.',
        variant: 'destructive'
      });
    }
    setPhotos(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (photos.length !== 3) {
      toast({
        title: 'Photos required',
        description: 'Kindly upload exactly three clear event images.',
        variant: 'destructive'
      });
      return;
    }

    const requiredFields: Array<keyof EventFormState> = [
      'fullName',
      'email',
      'institution',
      'country',
      'eventTitle',
      'eventType',
      'eventDate',
      'eventLocation',
      'eventDescription'
    ];

    const missing = requiredFields.filter(field => !formState[field]);
    if (missing.length > 0) {
      toast({
        title: 'Missing information',
        description: 'Please complete all mandatory fields marked with *.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('full_name', formState.fullName);
      payload.append('email', formState.email);
      payload.append('institution', formState.institution);
      payload.append('country', formState.country);
      payload.append('phone_country_code', selectedCountry?.dialCode ?? '');
      payload.append('phone_number', formState.phoneNumber);
      payload.append('event_title', formState.eventTitle);
      payload.append('event_type', formState.eventType);
      payload.append('event_date', formState.eventDate);
      payload.append('event_location', formState.eventLocation);
      payload.append('event_description', formState.eventDescription);
      payload.append('event_objectives', formState.eventObjectives);
      payload.append('target_audience', formState.targetAudience);

      photos.forEach(file => payload.append('photos[]', file));

      const response = await fetch('https://www.sme-res.org/api/event-submissions.php', {
        method: 'POST',
        body: payload
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to submit event. Please try again.');
      }

      toast({
        title: 'Submission received',
        description: 'Thank you! Our admin team will review your event shortly.'
      });
      setFormState(defaultState);
      setSelectedCountry(countryDialCodes[0]);
      setPhotos([]);
    } catch (error) {
      console.error('Event submission failed', error);
      toast({
        title: 'Submission failed',
        description: error instanceof Error ? error.message : 'Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="member-event-form" className="mt-16">
      <div className="card-academic p-8">
        <div className="mb-8 text-center">
          <h3 className="text-heading-2 mb-3">SMER Member Event Submission Form</h3>
          {/* <p className="text-muted-foreground text-sm max-w-3xl mx-auto">
            Share your upcoming or recently hosted SMER-aligned events. Provide accurate details and three clear photographs.
            Once approved, your submission will be showcased in the Event Gallery.
          </p> */}  
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label className="font-semibold">Member Information</Label>
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="fullName">*Full Name</Label>
                  <Input
                    id="fullName"
                    value={formState.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">*Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formState.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="name@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="institution">*Institution / Organization</Label>
                  <Input
                    id="institution"
                    value={formState.institution}
                    onChange={(e) => handleInputChange('institution', e.target.value)}
                    placeholder="Name of your institution"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">*Country</Label>
                  <select
                    id="country"
                    value={formState.country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                  >
                    {countryDialCodes.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.name} ({country.dialCode})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm font-semibold">
                      {selectedCountry?.dialCode ?? '+00'}
                    </span>
                    <Input
                      id="phone"
                      type="tel"
                      value={formState.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="Enter phone number"
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label className="font-semibold">Event Information</Label>
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="eventTitle">*Event Title</Label>
                  <Input
                    id="eventTitle"
                    value={formState.eventTitle}
                    onChange={(e) => handleInputChange('eventTitle', e.target.value)}
                    placeholder="Title to display on SMER website"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="eventType">*Event Type</Label>
                  <select
                    id="eventType"
                    value={formState.eventType}
                    onChange={(e) => handleInputChange('eventType', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                  >
                    {eventTypeOptions.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="eventDate">*Event Date</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={formState.eventDate}
                    onChange={(e) => handleInputChange('eventDate', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="eventLocation">*Event Location (City, Country)</Label>
                  <Input
                    id="eventLocation"
                    value={formState.eventLocation}
                    onChange={(e) => handleInputChange('eventLocation', e.target.value)}
                    placeholder="e.g., Chennai, India"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="eventDescription">*Event Description</Label>
                  <Textarea
                    id="eventDescription"
                    rows={4}
                    value={formState.eventDescription}
                    onChange={(e) => handleInputChange('eventDescription', e.target.value)}
                    placeholder="Brief summary to be displayed on the SMER website"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="eventObjectives">Event Objectives / Purpose (Optional)</Label>
              <Textarea
                id="eventObjectives"
                rows={4}
                value={formState.eventObjectives}
                onChange={(e) => handleInputChange('eventObjectives', e.target.value)}
                placeholder="What were the aims of this event?"
              />
            </div>
            <div>
              <Label htmlFor="targetAudience">Target Participants / Audience (Optional)</Label>
              <Textarea
                id="targetAudience"
                rows={4}
                value={formState.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                placeholder="Who participated or benefited from this event?"
              />
            </div>
          </div>

          <div>
            <Label className="font-semibold">*Photo Upload (Any three clear pictures)</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Upload three high-resolution images (JPG, PNG, or WEBP). Maximum size per image: 6MB.
            </p>
            <Input
              id="photos"
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              required
            />
            {photos.length > 0 && (
              <ul className="mt-3 text-sm text-slate-600 list-disc list-inside">
                {photos.map((file) => (
                  <li key={file.name}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="pt-4 border-t border-border">
            <Button type="submit" size="lg" className="w-full sm:w-auto bg-primary text-white hover:bg-primary-hover" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Event for Review'}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              An acknowledgment email will be sent to SMER admin.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EventSubmissionForm;

