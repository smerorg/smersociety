import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Member {
  id: number;
  name: string;
  institution: string;
  email: string;
  mobile: string;
  country: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
}

interface MemberDetails extends Member {
  scopus_link?: string;
  orcid_link?: string;
  google_scholar_link?: string;
  rejection_reason?: string;
  approved_by?: string;
  approved_at?: string;
}

interface EventSubmission {
  id: number;
  full_name: string;
  email: string;
  country: string;
  event_title: string;
  event_type: string;
  event_location: string;
  event_date: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface EventSubmissionDetails extends EventSubmission {
  institution: string;
  phone_country_code?: string | null;
  phone_number?: string | null;
  event_description: string;
  event_objectives?: string | null;
  target_audience?: string | null;
  photos?: Array<{ path: string; url: string | null }>;
  approved_photo_path?: string | null;
  approved_photo_url?: string | null;
  admin_notes?: string | null;
}

const AdminPanel = () => {
  const { toast } = useToast();
  const [activeModule, setActiveModule] = useState<'members' | 'events'>('members');
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<MemberDetails | null>(null);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  const [eventFilter, setEventFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [eventSubmissions, setEventSubmissions] = useState<EventSubmission[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventSubmissionDetails | null>(null);
  const [eventLoading, setEventLoading] = useState(false);
  const [eventSelectedPhoto, setEventSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (activeModule === 'members') {
      fetchMembers();
      fetchStats();
    }
  }, [activeModule, filter]);

  useEffect(() => {
    if (activeModule === 'events') {
      fetchEventSubmissions();
    }
  }, [activeModule, eventFilter]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://www.sme-res.org/api/admin-members.php?status=${filter}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setMembers(data.data);
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch members',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch members: ' + (error instanceof Error ? error.message : 'Unknown error'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEventSubmissions = async () => {
    setEventLoading(true);
    try {
      const response = await fetch(`https://www.sme-res.org/api/event-submissions.php?status=${eventFilter}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      setEventSubmissions(data.data || []);
    } catch (error) {
      console.error('Error fetching event submissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch event submissions: ' + (error instanceof Error ? error.message : 'Unknown error'),
        variant: 'destructive',
      });
    } finally {
      setEventLoading(false);
    }
  };

  const viewEventDetails = async (eventId: number) => {
    try {
      const response = await fetch(`https://www.sme-res.org/api/event-submissions.php?id=${eventId}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setSelectedEvent(data.data);
        setEventSelectedPhoto(data.data.approved_photo_path ?? data.data.photos?.[0]?.path ?? null);
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch event details',
        variant: 'destructive',
      });
    }
  };

  const closeEventModal = () => {
    setSelectedEvent(null);
    setEventSelectedPhoto(null);
  };

  const approveEventSubmission = async (eventId: number) => {
    if (!eventSelectedPhoto) {
      toast({
        title: 'Select a photo',
        description: 'Please choose a photo to highlight in the gallery before approving.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(`https://www.sme-res.org/api/event-submissions.php?id=${eventId}&action=approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved_photo: eventSelectedPhoto }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || `HTTP ${response.status}`);
      }

      toast({
        title: 'Event approved',
        description: 'The event has been approved and will appear in the gallery.',
      });

      fetchEventSubmissions();
      closeEventModal();
    } catch (error) {
      console.error('Error approving event submission:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve event: ' + (error instanceof Error ? error.message : 'Unknown error'),
        variant: 'destructive',
      });
    }
  };

  const rejectEventSubmission = async (eventId: number) => {
    try {
      const response = await fetch(`https://www.sme-res.org/api/event-submissions.php?id=${eventId}&action=reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Event submission does not meet the guidelines.' }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || `HTTP ${response.status}`);
      }

      toast({
        title: 'Event rejected',
        description: 'The submitter has been informed.',
      });

      fetchEventSubmissions();
      closeEventModal();
    } catch (error) {
      console.error('Error rejecting event submission:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject event: ' + (error instanceof Error ? error.message : 'Unknown error'),
        variant: 'destructive',
      });
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('https://www.sme-res.org/api/admin-members.php', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const viewMemberDetails = async (memberId: number) => {
    try {
      const response = await fetch(`https://www.sme-res.org/api/admin-members.php?id=${memberId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSelectedMember(data.data);
      }
    } catch (error) {
      console.error('Error fetching member details:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch member details',
        variant: 'destructive',
      });
    }
  };

  const approveMember = async (memberId: number) => {
    try {
      const response = await fetch(`https://www.sme-res.org/api/admin-members.php?id=${memberId}&action=approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved_by: 'admin' }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Member approved successfully and approval email sent',
        });
        fetchMembers();
        fetchStats();
        setSelectedMember(null);
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to approve member',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error approving member:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve member: ' + (error instanceof Error ? error.message : 'Unknown error'),
        variant: 'destructive',
      });
    }
  };

  const rejectMember = async (memberId: number, reason: string) => {
    try {
      const response = await fetch(`https://www.sme-res.org/api/admin-members.php?id=${memberId}&action=reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Member rejected successfully',
        });
        fetchMembers();
        fetchStats();
        setSelectedMember(null);
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to reject member',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error rejecting member:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject member: ' + (error instanceof Error ? error.message : 'Unknown error'),
        variant: 'destructive',
      });
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container-academic">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">SMER Admin Panel</h1>
          <p className="text-slate-600">Review membership applications and member-submitted events.</p>
        </div>

        <div className="flex gap-3 mb-8">
          <Button
            variant={activeModule === 'members' ? 'default' : 'outline'}
            onClick={() => setActiveModule('members')}
            className="flex-1"
          >
            Member Applications
          </Button>
          <Button
            variant={activeModule === 'events' ? 'default' : 'outline'}
            onClick={() => setActiveModule('events')}
            className="flex-1"
          >
            Event Submissions
          </Button>
        </div>

        {activeModule === 'members' && (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600">Total Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600">Approved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600">Rejected</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
                </CardContent>
              </Card>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
              {(['pending', 'approved', 'rejected'] as const).map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? 'default' : 'outline'}
                  onClick={() => setFilter(status)}
                  className="capitalize"
                >
                  {status === 'pending' && <Clock className="w-4 h-4 mr-2" />}
                  {status === 'approved' && <CheckCircle className="w-4 h-4 mr-2" />}
                  {status === 'rejected' && <XCircle className="w-4 h-4 mr-2" />}
                  {status}
                </Button>
              ))}
            </div>

            {/* Members List */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)} Applications ({members.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-slate-600">Loading...</div>
                ) : members.length === 0 ? (
                  <div className="text-center py-8 text-slate-600">No {filter} applications</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-4 font-semibold text-slate-700">Name</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700">Institution</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700">Email</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700">Country</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700">Submitted</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((member) => (
                          <tr key={member.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-3 px-4 text-slate-900">{member.name}</td>
                            <td className="py-3 px-4 text-slate-700">{member.institution}</td>
                            <td className="py-3 px-4 text-slate-700">{member.email}</td>
                            <td className="py-3 px-4 text-slate-700">{member.country}</td>
                            <td className="py-3 px-4 text-slate-600 text-sm">
                              {new Date(member.submitted_at).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => viewMemberDetails(member.id)}
                                className="text-blue-600 hover:bg-blue-50"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {activeModule === 'events' && (
          <>
            <div className="flex gap-2 mb-6">
              {(['pending', 'approved', 'rejected'] as const).map((status) => (
                <Button
                  key={status}
                  variant={eventFilter === status ? 'default' : 'outline'}
                  onClick={() => setEventFilter(status)}
                  className="capitalize"
                >
                  {status === 'pending' && <Clock className="w-4 h-4 mr-2" />}
                  {status === 'approved' && <CheckCircle className="w-4 h-4 mr-2" />}
                  {status === 'rejected' && <XCircle className="w-4 h-4 mr-2" />}
                  {status}
                </Button>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>
                  {eventFilter.charAt(0).toUpperCase() + eventFilter.slice(1)} Event Submissions ({eventSubmissions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {eventLoading ? (
                  <div className="text-center py-8 text-slate-600">Loading...</div>
                ) : eventSubmissions.length === 0 ? (
                  <div className="text-center py-8 text-slate-600">No {eventFilter} event submissions</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-4 font-semibold text-slate-700">Event Title</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700">Type</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700">Country</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700">Date</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700">Submitted</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {eventSubmissions.map((event) => (
                          <tr key={event.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-3 px-4 text-slate-900">{event.event_title}</td>
                            <td className="py-3 px-4 text-slate-700">{event.event_type}</td>
                            <td className="py-3 px-4 text-slate-700">{event.country}</td>
                            <td className="py-3 px-4 text-slate-600 text-sm">
                              {event.event_date ? new Date(event.event_date).toLocaleDateString() : 'TBD'}
                            </td>
                            <td className="py-3 px-4 text-slate-600 text-sm">
                              {new Date(event.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => viewEventDetails(event.id)}
                                className="text-blue-600 hover:bg-blue-50"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Member Details Modal */}
        {selectedMember && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>{selectedMember.name}</CardTitle>
                <CardDescription>Application Details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-600">Institution</p>
                    <p className="text-slate-900">{selectedMember.institution}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-600">Email</p>
                    <p className="text-slate-900">{selectedMember.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-600">Mobile</p>
                    <p className="text-slate-900">{selectedMember.mobile}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-600">Country</p>
                    <p className="text-slate-900">{selectedMember.country}</p>
                  </div>
                </div>

                {selectedMember.scopus_link && (
                  <div>
                    <p className="text-sm font-semibold text-slate-600">Scopus Link</p>
                    <a href={selectedMember.scopus_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {selectedMember.scopus_link}
                    </a>
                  </div>
                )}

                {selectedMember.orcid_link && (
                  <div>
                    <p className="text-sm font-semibold text-slate-600">ORCID Link</p>
                    <a href={selectedMember.orcid_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {selectedMember.orcid_link}
                    </a>
                  </div>
                )}

                {selectedMember.google_scholar_link && (
                  <div>
                    <p className="text-sm font-semibold text-slate-600">Google Scholar Link</p>
                    <a href={selectedMember.google_scholar_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {selectedMember.google_scholar_link}
                    </a>
                  </div>
                )}

                {selectedMember.status === 'pending' && (
                  <div className="flex gap-2 pt-4 border-t border-slate-200">
                    <Button
                      onClick={() => approveMember(selectedMember.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => rejectMember(selectedMember.id, 'Application does not meet requirements')}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}

                {selectedMember.status === 'approved' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800">
                      <CheckCircle className="w-5 h-5 inline mr-2" />
                      Approved on {new Date(selectedMember.approved_at || '').toLocaleDateString()}
                    </p>
                  </div>
                )}

                {selectedMember.status === 'rejected' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-semibold mb-2">Rejection Reason:</p>
                    <p className="text-red-700">{selectedMember.rejection_reason}</p>
                  </div>
                )}

                <Button
                  onClick={() => setSelectedMember(null)}
                  variant="outline"
                  className="w-full"
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>{selectedEvent.event_title}</CardTitle>
                <CardDescription>
                  Submitted by {selectedEvent.full_name} • {selectedEvent.event_type}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-600">Event Date</p>
                    <p className="text-slate-900">
                      {selectedEvent.event_date ? new Date(selectedEvent.event_date).toLocaleDateString() : 'TBD'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-600">Location</p>
                    <p className="text-slate-900">{selectedEvent.event_location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-600">Member Email</p>
                    <p className="text-slate-900">{selectedEvent.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-600">Institution</p>
                    <p className="text-slate-900">{selectedEvent.institution}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-600 mb-1">Description</p>
                  <p className="text-slate-800 leading-relaxed">{selectedEvent.event_description}</p>
                </div>

                {selectedEvent.event_objectives && (
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-1">Objectives</p>
                    <p className="text-slate-800">{selectedEvent.event_objectives}</p>
                  </div>
                )}

                {selectedEvent.target_audience && (
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-1">Target Participants</p>
                    <p className="text-slate-800">{selectedEvent.target_audience}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-semibold text-slate-600 mb-2">Uploaded Photos</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectedEvent.photos?.map((photo) => (
                      <button
                        key={photo.path}
                        type="button"
                        className={`relative rounded-lg overflow-hidden border-2 ${
                          eventSelectedPhoto === photo.path ? 'border-primary' : 'border-transparent'
                        }`}
                        onClick={() => setEventSelectedPhoto(photo.path)}
                      >
                        <img
                          src={photo.url || 'https://placehold.co/400x250?text=SMER'}
                          alt="Event submission"
                          className="w-full h-32 object-cover"
                        />
                        <span className="absolute bottom-2 left-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded">
                          {eventSelectedPhoto === photo.path ? 'Selected' : 'Select'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedEvent.status === 'pending' && (
                  <div className="flex gap-2 pt-4 border-t border-slate-200">
                    <Button
                      onClick={() => approveEventSubmission(selectedEvent.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve & Publish
                    </Button>
                    <Button
                      onClick={() => rejectEventSubmission(selectedEvent.id)}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}

                {selectedEvent.status === 'approved' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800">
                      <CheckCircle className="w-5 h-5 inline mr-2" />
                      Approved and visible in Event Gallery
                    </p>
                  </div>
                )}

                {selectedEvent.status === 'rejected' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-semibold mb-2">Rejected Submission</p>
                    <p className="text-red-700">{selectedEvent.admin_notes || 'No reason provided'}</p>
                  </div>
                )}
              </CardContent>
              <div className="flex justify-end p-6 pt-0">
                <Button variant="outline" onClick={closeEventModal}>
                  Close
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminPanel;
