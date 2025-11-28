import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface Member {
  id: number;
  name: string;
  institution: string;
  email: string;
  country: string;
  scopus_link?: string;
  orcid_link?: string;
  google_scholar_link?: string;
  approved_at: string;
}

const MembersScreen = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalMembers, setTotalMembers] = useState(0);

  useEffect(() => {
    fetchApprovedMembers();
  }, []);

  useEffect(() => {
    // Filter members based on search term
    const filtered = members.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMembers(filtered);
  }, [searchTerm, members]);

  const fetchApprovedMembers = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://www.sme-res.org/api/admin-members.php?status=approved', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setMembers(data.data);
        setTotalMembers(data.count);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container-academic">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Our Active Members</h1>
          <p className="text-slate-600 mb-6">
            Meet the members of the Society for Modern English Research
          </p>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search by name, institution, country, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-2"
            />
          </div>
        </div>

        {/* Members Count */}
        <div className="mb-6 text-slate-600">
          Showing {filteredMembers.length} of {totalMembers} members
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-600">Loading members...</div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-12 text-slate-600">
            {searchTerm ? 'No members found matching your search' : 'No approved members yet'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription>{member.institution}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MembersScreen;
