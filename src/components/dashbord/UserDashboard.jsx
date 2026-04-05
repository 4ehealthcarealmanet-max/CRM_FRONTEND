
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Phone, Mail, Calendar, Users, UserPlus, TrendingUp, Filter, Search,
  AlertCircle, CheckCircle, LogOut, Bell, Building2, Stethoscope, 
  ArrowUpRight, X, Menu, LayoutDashboard, Hospital, Loader2,
  Clock, Eye, UserCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from 'react-hot-toast';
import { 
  createLead, getLeadTypes, getSources, getMyLeads
} from "../../services/leads";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [leads, setLeads] = useState([]);
  const [leadTypes, setLeadTypes] = useState([]);
  const [sources, setSources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form State
  const [newLead, setNewLead] = useState({
    lead_type_id: "",
    source_id: "",
    name: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    pincode: "",
    address: "",
    priority: "medium",
    notes: "",
    doctor_specialization: "",
    doctor_qualification: "",
    doctor_consultation_fee: "",
    doctor_experience_years: "",
    doctor_hospital_name: "",
    hospital_type: "",
    hospital_beds_count: "",
    hospital_icu_beds: "",
    hospital_emergency_available: "",
    hospital_accreditation: "",
    pharmacy_license_number: "",
    pharmacy_gst_number: "",
    pharmacy_store_type: "",
    pharmacy_chain_name: "",
    lab_accreditation: "",
    lab_test_types: "",
    lab_equipment_level: "",
    patient_age: "",
    patient_gender: "",
    patient_medical_history: "",
    patient_insurance_provider: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadTypesRes, sourcesRes, myLeadsRes] = await Promise.all([
        getLeadTypes(),
        getSources(),
        getMyLeads()
      ]);
      if (leadTypesRes.success) setLeadTypes(leadTypesRes.data);
      if (sourcesRes.success) setSources(sourcesRes.data);
      if (myLeadsRes.success) setLeads(myLeadsRes.data);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = async () => {
    if (!newLead.lead_type_id || !newLead.name) {
      toast.error("Please select lead type and enter name!");
      return;
    }
    setSubmitting(true);
    try {
      const response = await createLead(newLead);
      if (response.success) {
        toast.success("Lead created successfully! Waiting for verification.");
        setShowAddModal(false);
        setNewLead({
          lead_type_id: "", source_id: "", name: "", phone: "", email: "",
          city: "", state: "", pincode: "", address: "", priority: "medium",
          notes: "", doctor_specialization: "", doctor_qualification: "",
          doctor_consultation_fee: "", doctor_experience_years: "", doctor_hospital_name: "",
          hospital_type: "", hospital_beds_count: "", hospital_icu_beds: "",
          hospital_emergency_available: "", hospital_accreditation: "",
          pharmacy_license_number: "", pharmacy_gst_number: "", pharmacy_store_type: "",
          pharmacy_chain_name: "", lab_accreditation: "", lab_test_types: "",
          lab_equipment_level: "", patient_age: "", patient_gender: "",
          patient_medical_history: "", patient_insurance_provider: ""
        });
        fetchData();
      } else {
        toast.error(response.message || "Failed to create lead");
      }
    } catch (error) {
      toast.error("Failed to create lead");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out successfully!");
  };

  const getDynamicFields = () => {
    const selectedType = leadTypes.find(t => t.id === parseInt(newLead.lead_type_id));
    if (!selectedType) return null;

    switch (selectedType.name) {
      case 'doctor':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Specialization" value={newLead.doctor_specialization} onChange={(e) => setNewLead({...newLead, doctor_specialization: e.target.value})} className="px-4 py-2 border rounded-lg" />
            <input type="text" placeholder="Qualification (MBBS, MD)" value={newLead.doctor_qualification} onChange={(e) => setNewLead({...newLead, doctor_qualification: e.target.value})} className="px-4 py-2 border rounded-lg" />
            <input type="number" placeholder="Consultation Fee (₹)" value={newLead.doctor_consultation_fee} onChange={(e) => setNewLead({...newLead, doctor_consultation_fee: e.target.value})} className="px-4 py-2 border rounded-lg" />
            <input type="number" placeholder="Experience (Years)" value={newLead.doctor_experience_years} onChange={(e) => setNewLead({...newLead, doctor_experience_years: e.target.value})} className="px-4 py-2 border rounded-lg" />
            <input type="text" placeholder="Hospital/Clinic Name" value={newLead.doctor_hospital_name} onChange={(e) => setNewLead({...newLead, doctor_hospital_name: e.target.value})} className="px-4 py-2 border rounded-lg md:col-span-2" />
          </div>
        );
      case 'hospital':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select value={newLead.hospital_type} onChange={(e) => setNewLead({...newLead, hospital_type: e.target.value})} className="px-4 py-2 border rounded-lg">
              <option value="">Hospital Type</option>
              <option value="Private">Private</option><option value="Government">Government</option>
              <option value="Trust">Trust</option><option value="Corporate">Corporate</option>
            </select>
            <input type="number" placeholder="Total Beds" value={newLead.hospital_beds_count} onChange={(e) => setNewLead({...newLead, hospital_beds_count: e.target.value})} className="px-4 py-2 border rounded-lg" />
            <input type="number" placeholder="ICU Beds" value={newLead.hospital_icu_beds} onChange={(e) => setNewLead({...newLead, hospital_icu_beds: e.target.value})} className="px-4 py-2 border rounded-lg" />
            <select value={newLead.hospital_emergency_available} onChange={(e) => setNewLead({...newLead, hospital_emergency_available: e.target.value})} className="px-4 py-2 border rounded-lg">
              <option value="">Emergency Available</option><option value="true">Yes</option><option value="false">No</option>
            </select>
            <input type="text" placeholder="Accreditation (NABH, JCI)" value={newLead.hospital_accreditation} onChange={(e) => setNewLead({...newLead, hospital_accreditation: e.target.value})} className="px-4 py-2 border rounded-lg md:col-span-2" />
          </div>
        );
      case 'pharmacy':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="License Number" value={newLead.pharmacy_license_number} onChange={(e) => setNewLead({...newLead, pharmacy_license_number: e.target.value})} className="px-4 py-2 border rounded-lg" />
            <input type="text" placeholder="GST Number" value={newLead.pharmacy_gst_number} onChange={(e) => setNewLead({...newLead, pharmacy_gst_number: e.target.value})} className="px-4 py-2 border rounded-lg" />
            <select value={newLead.pharmacy_store_type} onChange={(e) => setNewLead({...newLead, pharmacy_store_type: e.target.value})} className="px-4 py-2 border rounded-lg">
              <option value="">Store Type</option><option value="Retail">Retail</option><option value="Wholesale">Wholesale</option><option value="Chain">Chain</option>
            </select>
            <input type="text" placeholder="Chain Name" value={newLead.pharmacy_chain_name} onChange={(e) => setNewLead({...newLead, pharmacy_chain_name: e.target.value})} className="px-4 py-2 border rounded-lg" />
          </div>
        );
      case 'lab':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Accreditation (NABL, CAP)" value={newLead.lab_accreditation} onChange={(e) => setNewLead({...newLead, lab_accreditation: e.target.value})} className="px-4 py-2 border rounded-lg" />
            <input type="text" placeholder="Test Types (Blood, Pathology)" value={newLead.lab_test_types} onChange={(e) => setNewLead({...newLead, lab_test_types: e.target.value})} className="px-4 py-2 border rounded-lg" />
            <select value={newLead.lab_equipment_level} onChange={(e) => setNewLead({...newLead, lab_equipment_level: e.target.value})} className="px-4 py-2 border rounded-lg">
              <option value="">Equipment Level</option><option value="Basic">Basic</option><option value="Advanced">Advanced</option><option value="Premium">Premium</option>
            </select>
          </div>
        );
      case 'patient':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="number" placeholder="Age" value={newLead.patient_age} onChange={(e) => setNewLead({...newLead, patient_age: e.target.value})} className="px-4 py-2 border rounded-lg" />
            <select value={newLead.patient_gender} onChange={(e) => setNewLead({...newLead, patient_gender: e.target.value})} className="px-4 py-2 border rounded-lg">
              <option value="">Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
            </select>
            <textarea placeholder="Medical History" value={newLead.patient_medical_history} onChange={(e) => setNewLead({...newLead, patient_medical_history: e.target.value})} rows="2" className="px-4 py-2 border rounded-lg md:col-span-2" />
            <input type="text" placeholder="Insurance Provider" value={newLead.patient_insurance_provider} onChange={(e) => setNewLead({...newLead, patient_insurance_provider: e.target.value})} className="px-4 py-2 border rounded-lg md:col-span-2" />
          </div>
        );
      default: return null;
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending_verification: "bg-yellow-50 text-yellow-700 border-yellow-200",
      assigned: "bg-blue-50 text-blue-700 border-blue-200",
      verified: "bg-purple-50 text-purple-700 border-purple-200",
      approved: "bg-green-50 text-green-700 border-green-200",
      converted: "bg-emerald-50 text-emerald-700 border-emerald-200",
      rejected: "bg-red-50 text-red-700 border-red-200"
    };
    const labels = {
      pending_verification: "Pending Verification",
      assigned: "Assigned",
      verified: "Verified",
      approved: "Approved",
      converted: "Converted",
      rejected: "Rejected"
    };
    return <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium border ${colors[status] || colors.pending_verification}`}>{labels[status] || status}</span>;
  };

  const filteredLeads = leads.filter(lead => 
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">MedBridge CRM</h1>
            <p className="text-sm text-gray-500">Lead Creator Dashboard | Welcome, {user?.name || "User"}! 👋</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4" /> Create Lead
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCardSmall title="Total Leads" value={leads.length} icon={Users} color="blue" />
          <StatCardSmall title="Pending Verification" value={leads.filter(l => l.status === "pending_verification").length} icon={Clock} color="yellow" />
          <StatCardSmall title="Verified" value={leads.filter(l => l.status === "verified").length} icon={UserCheck} color="purple" />
          <StatCardSmall title="Converted" value={leads.filter(l => l.status === "converted").length} icon={TrendingUp} color="green" />
        </div>

        <div className="bg-white rounded-xl border">
          <div className="p-5 border-b flex flex-col sm:flex-row justify-between gap-4">
            <h2 className="text-lg font-semibold">My Created Leads</h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search leads..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 border rounded-lg" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr><th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Name</th><th className="px-5 py-3 text-left text-xs font-medium text-gray-500 hidden md:table-cell">Type</th><th className="px-5 py-3 text-left text-xs font-medium text-gray-500 hidden lg:table-cell">City</th><th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Status</th><th className="px-5 py-3 text-left text-xs font-medium text-gray-500 hidden sm:table-cell">Created</th></tr>
              </thead>
              <tbody>
                {filteredLeads.map(lead => (
                  <tr key={lead.id} className="border-t hover:bg-gray-50">
                    <td className="px-5 py-4"><div className="font-medium">{lead.name}</div><div className="text-xs text-gray-500 md:hidden">{lead.lead_type_name}</div></td>
                    <td className="px-5 py-4 text-sm text-gray-600 hidden md:table-cell">{lead.lead_type_name}</td>
                    <td className="px-5 py-4 text-sm text-gray-600 hidden lg:table-cell">{lead.city || "-"}</td>
                    <td className="px-5 py-4">{getStatusBadge(lead.status)}</td>
                    <td className="px-5 py-4 text-sm text-gray-500 hidden sm:table-cell">{new Date(lead.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredLeads.length === 0 && <div className="text-center py-12"><AlertCircle className="w-12 h-12 text-gray-200 mx-auto mb-3" /><p className="text-gray-500">No leads found</p><button onClick={() => setShowAddModal(true)} className="mt-3 text-blue-600">Create your first lead →</button></div>}
          </div>
        </div>
      </div>

      {/* Add Lead Modal */}
      <AnimatePresence>{showAddModal && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto"><h3 className="text-xl font-semibold mb-4">Create New Lead</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Lead Type *</label><select value={newLead.lead_type_id} onChange={(e) => setNewLead({...newLead, lead_type_id: e.target.value})} className="w-full px-4 py-2 border rounded-lg"><option value="">Select Lead Type</option>{leadTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div><div><label className="block text-sm font-medium mb-1">Source</label><select value={newLead.source_id} onChange={(e) => setNewLead({...newLead, source_id: e.target.value})} className="w-full px-4 py-2 border rounded-lg"><option value="">Select Source</option>{sources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div><div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Name *</label><input type="text" placeholder="Enter name" value={newLead.name} onChange={(e) => setNewLead({...newLead, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">Phone</label><input type="tel" placeholder="Phone" value={newLead.phone} onChange={(e) => setNewLead({...newLead, phone: e.target.value})} className="w-full px-4 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">Email</label><input type="email" placeholder="Email" value={newLead.email} onChange={(e) => setNewLead({...newLead, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">City</label><input type="text" placeholder="City" value={newLead.city} onChange={(e) => setNewLead({...newLead, city: e.target.value})} className="w-full px-4 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">State</label><input type="text" placeholder="State" value={newLead.state} onChange={(e) => setNewLead({...newLead, state: e.target.value})} className="w-full px-4 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">Pincode</label><input type="text" placeholder="Pincode" value={newLead.pincode} onChange={(e) => setNewLead({...newLead, pincode: e.target.value})} className="w-full px-4 py-2 border rounded-lg" /></div><div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Address</label><textarea placeholder="Full address" value={newLead.address} onChange={(e) => setNewLead({...newLead, address: e.target.value})} rows="2" className="w-full px-4 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">Priority</label><select value={newLead.priority} onChange={(e) => setNewLead({...newLead, priority: e.target.value})} className="w-full px-4 py-2 border rounded-lg"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div><div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Notes</label><textarea placeholder="Additional notes..." value={newLead.notes} onChange={(e) => setNewLead({...newLead, notes: e.target.value})} rows="2" className="w-full px-4 py-2 border rounded-lg" /></div></div>{getDynamicFields()}<div className="flex gap-3 mt-6"><button onClick={handleAddLead} disabled={submitting} className="flex-1 bg-blue-600 text-white py-2 rounded-lg">{submitting ? "Creating..." : "Create Lead"}</button><button onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-100 py-2 rounded-lg">Cancel</button></div></motion.div></motion.div>)}</AnimatePresence>
    </div>
  );
};

const StatCardSmall = ({ title, value, icon: Icon, color }) => {
  const colors = { blue: "bg-blue-50 text-blue-600", yellow: "bg-yellow-50 text-yellow-600", purple: "bg-purple-50 text-purple-600", green: "bg-green-50 text-green-600" };
  return <div className="bg-white rounded-xl border p-4"><div className="flex justify-between"><div><p className="text-xs text-gray-500">{title}</p><p className="text-2xl font-bold">{value}</p></div><div className={`w-10 h-10 ${colors[color]} rounded-lg flex items-center justify-center`}><Icon className="w-5 h-5" /></div></div></div>;
};

export default UserDashboard;